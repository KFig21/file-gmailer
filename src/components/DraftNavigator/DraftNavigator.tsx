// src/components/DraftNavigator/DraftNavigator.tsx
// import GitHubIcon from '@mui/icons-material/GitHub';
import './styles.scss';

type Props = {
  drafts: { file: File }[];
  maxDrafts: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  createAllDrafts: () => void;
  onFilesAdded: (files: File[]) => void;
  loading: boolean;
};

export default function DraftNavigator({
  drafts,
  maxDrafts,
  activeIndex,
  onSelect,
  createAllDrafts,
  onFilesAdded,
  loading,
}: Props) {

  const handleCreateDrafts = () => {
    if (loading) return;
    createAllDrafts();
  };

  const isFull = drafts.length >= maxDrafts;

  return (
    <div className="sidebar-wrapper">
      {/* TOP BUTTON */}
      <div className="sidebar-top">
        <label className={`sidebar-dropzone-button ${isFull ? 'disabled' : ''}`}>
          {isFull ? 'Max files reached' : 'Choose files'}
          <input
            type="file"
            multiple
            disabled={isFull}
            onChange={(e) => e.target.files && onFilesAdded(Array.from(e.target.files))}
            hidden
          />
        </label>
      </div>

      {/* SCROLLABLE LIST */}
      <aside className="drafts-sidebar">
        {drafts.map((draft, index) => (
          <div
            key={index}
            onClick={() => onSelect(index)}
            className={`sidebar-item ${activeIndex === index ? 'active' : ''}`}
          >
            <span>{draft.file.name}</span>
          </div>
        ))}
      </aside>

      {/* BOTTOM STICKY BUTTON */}
      <div className="sidebar-bottom">
        <div
          className={`sidebar-create-drafts-button ${loading ? 'disabled' : ''}`}
          onClick={handleCreateDrafts}
        >
          {loading ? <span className="spinner" /> : 'Create drafts'}
        </div>
      </div>
    </div>
  );
}
