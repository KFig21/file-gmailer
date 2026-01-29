import './styles.scss';

type Props = {
  onAuthAction: () => void;
  isAuthenticated: boolean;
};

export default function HeaderSignInButton({ onAuthAction, isAuthenticated }: Props) {
  return (
    <div className={`sign-in-button-container`}>
      <button 
        className={`sign-in-button ${isAuthenticated ? 'has-token' : ''}`} 
        onClick={onAuthAction}
      >
        {isAuthenticated ? 'Sign Out' : 'Sign in with Google'}
      </button>
    </div>
  );
}