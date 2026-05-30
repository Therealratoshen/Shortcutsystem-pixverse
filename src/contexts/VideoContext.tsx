import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  AppState,
  WizardStep,
  Template,
  UploadedImage,
  GeneratedVideo,
  VideoClip,
} from '../types';

// Action types
type VideoAction =
  | { type: 'SET_VIEW'; payload: AppState['currentView'] }
  | { type: 'SET_WIZARD_STEP'; payload: WizardStep }
  | { type: 'SET_TEMPLATE'; payload: Template | null }
  | { type: 'SET_UPLOADED_IMAGE'; payload: UploadedImage | null }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_GENERATION_PROGRESS'; payload: number }
  | { type: 'ADD_GENERATED_VIDEO'; payload: GeneratedVideo }
  | { type: 'UPDATE_VIDEO'; payload: { id: string; updates: Partial<GeneratedVideo> } }
  | { type: 'ADD_VIDEO_CLIP'; payload: { videoId: string; clip: VideoClip } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_WIZARD' };

// Initial state
const initialState: AppState = {
  currentView: 'landing',
  wizardStep: 'upload',
  selectedTemplate: null,
  uploadedImage: null,
  generatedVideos: [],
  favorites: [],
  user: {
    tier: 'new',
    name: 'Fashion Seller',
    stats: {
      videosGenerated: 0,
      videosThisMonth: 0,
      clipsGenerated: 0,
      storageUsed: 0,
    },
    videosRemaining: 5,
    joinedAt: Date.now(),
  },
  isGenerating: false,
  generationProgress: 0,
  error: null,
};

// Reducer
function videoReducer(state: AppState, action: VideoAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };

    case 'SET_WIZARD_STEP':
      return { ...state, wizardStep: action.payload };

    case 'SET_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };

    case 'SET_UPLOADED_IMAGE':
      return { ...state, uploadedImage: action.payload };

    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };

    case 'SET_GENERATION_PROGRESS':
      return { ...state, generationProgress: action.payload };

    case 'ADD_GENERATED_VIDEO':
      return {
        ...state,
        generatedVideos: [action.payload, ...state.generatedVideos],
      };

    case 'UPDATE_VIDEO':
      return {
        ...state,
        generatedVideos: state.generatedVideos.map((video) =>
          video.id === action.payload.id
            ? { ...video, ...action.payload.updates }
            : video
        ),
      };

    case 'ADD_VIDEO_CLIP':
      return {
        ...state,
        generatedVideos: state.generatedVideos.map((video) =>
          video.id === action.payload.videoId
            ? { ...video, clips: [...video.clips, action.payload.clip] }
            : video
        ),
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'RESET_WIZARD':
      return {
        ...state,
        wizardStep: 'upload',
        selectedTemplate: null,
        uploadedImage: null,
        isGenerating: false,
        generationProgress: 0,
        error: null,
      };

    default:
      return state;
  }
}

// Context
interface VideoContextType {
  state: AppState;
  dispatch: React.Dispatch<VideoAction>;
  setView: (view: AppState['currentView']) => void;
  setWizardStep: (step: WizardStep) => void;
  setTemplate: (template: Template | null) => void;
  setUploadedImage: (image: UploadedImage | null) => void;
  addGeneratedVideo: (video: GeneratedVideo) => void;
  updateVideo: (id: string, updates: Partial<GeneratedVideo>) => void;
  resetWizard: () => void;
  setGenerating: (generating: boolean) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

// Provider
export function VideoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  const setView = (view: AppState['currentView']) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const setWizardStep = (step: WizardStep) => {
    dispatch({ type: 'SET_WIZARD_STEP', payload: step });
  };

  const setTemplate = (template: Template | null) => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  };

  const setUploadedImage = (image: UploadedImage | null) => {
    dispatch({ type: 'SET_UPLOADED_IMAGE', payload: image });
  };

  const addGeneratedVideo = (video: GeneratedVideo) => {
    dispatch({ type: 'ADD_GENERATED_VIDEO', payload: video });
  };

  const updateVideo = (id: string, updates: Partial<GeneratedVideo>) => {
    dispatch({ type: 'UPDATE_VIDEO', payload: { id, updates } });
  };

  const resetWizard = () => {
    dispatch({ type: 'RESET_WIZARD' });
  };

  const setGenerating = (generating: boolean) => {
    dispatch({ type: 'SET_GENERATING', payload: generating });
  };

  const setProgress = (progress: number) => {
    dispatch({ type: 'SET_GENERATION_PROGRESS', payload: progress });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  return (
    <VideoContext.Provider
      value={{
        state,
        dispatch,
        setView,
        setWizardStep,
        setTemplate,
        setUploadedImage,
        addGeneratedVideo,
        updateVideo,
        resetWizard,
        setGenerating,
        setProgress,
        setError,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

// Hook
export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
}
