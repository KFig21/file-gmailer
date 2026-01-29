import './styles.scss';

type Props = {
  onFilesAdded: (files: File[]) => void;
  isDrafts: boolean;
};

export default function FileDropzone({ onFilesAdded, isDrafts }: Props) {
  return (
    <div className={`dropzone-container ${isDrafts && 'showing-bulk-panel'}`}>
      <div
        onDrop={(e) => {
          e.preventDefault();
          onFilesAdded(Array.from(e.dataTransfer.files));
        }}
        onDragOver={(e) => e.preventDefault()}
        className="dropzone"
      >
        <div className="dropzone-text">Drag & drop files here</div>
        <div className="dropzone-subtext">or</div>
        <div className="dropzone-input-container">
          <label className="dropzone-button">
            Choose files
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && onFilesAdded(Array.from(e.target.files))}
              hidden
            />
          </label>
        </div>
      </div>
    </div>
  );
}
