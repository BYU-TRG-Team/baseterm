import React, { useRef, useState } from 'react';
import { validateTermbase } from "../../../services/api/baseterm";
import './index.css';
import { downloadFile, reloadPage } from '../../../utils';
import { NotificationManager } from 'react-notifications';
import LoadingSpinner from '../../LoadingSpinner';

const ValidationPage: React.FC = () => {
  const tbxFileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [tbxFile, setTbxFile ] = useState<null | File>(null);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (tbxFile === null) return;

    return validateTermbase({
      tbxFile,
      onError: (errorMessage) =>  NotificationManager.error(
        errorMessage,
        undefined,
        600000,
      ),
      onFinish: () => setLoading(false),
      onInit: () => setLoading(true),
      onSuccess: (response) => {
        downloadFile({
          data: JSON.stringify(response.tbx),
          fileName: "tbx-json.json",
          fileType: "text/json"
        });
        NotificationManager.success(
          "TBX file is valid. JSON representation of the file is being downloaded."
        );
        setIsComplete(true);
      }
    })
  }
 
  return (
    <main className="validation-page">
      <LoadingSpinner show={loading} />
      Check the validity of a TBX file against the core schema.
      <br />
      <br />
      <form 
        onSubmit={handleSubmit}
        className="validation-page__form"
      >
        <div className="validation-page__form-group">
          <input 
            type="file" 
            ref={tbxFileRef} 
            required
            id="tbxFile"
            onChange={(event) => { 
              if (event.target.files) {
                setTbxFile(event.target.files[0])
              }
            }}
            disabled={isComplete}
          />
        </div>
        <div className="validation-page__form-group">
          <input 
            type="submit"
            value="Validate"
            className="validation-page__form-input"
            disabled={isComplete}
          />
        </div>
      </form>
      <p>
        {
          isComplete &&
          <button 
            onClick={reloadPage}
            className="validation-page__form-input"  
          >
            Validate New Termbase
          </button>
        }
      </p>
    </main>
  )
}

export default ValidationPage;