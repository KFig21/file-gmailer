import './styles.scss';

type Props = {
  onClick: () => void;
  loading: boolean;
};

export default function CreateDraftsButton({ onClick, loading }: Props) {
  return (
    <button className="create-drafts-button" onClick={onClick} disabled={loading}>
      {loading ? 'Creating drafts…' : 'Create Gmail Drafts'}
    </button>
  );
}
