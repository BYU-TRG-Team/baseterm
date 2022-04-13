import React, { useState } from "react";
import { postTermbase } from "../../../services/api/baseterm";
import LoadingSpinner from "../../LoadingSpinner";
import LanguageDropdown from "../../dropdowns/LanguageDropdown";
import { NotificationManager } from 'react-notifications';
import './index.css';
import { reloadPage } from "../../../utils";

const CreatePage: React.FC = () => {
  const [language, setLanguage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  return (
    <main className="create-page">
      {
        /*
        * TODO: How can we make loading globalized
        */
      }
      <LoadingSpinner show={loading} />
      Create a new termbase.
      <br />
      <br />
      <form 
        onSubmit={(e) => {
          e.preventDefault();

          return postTermbase({
            name,
            language,
            description,
            onInit: () => setLoading(true),
            onError: (errorMessage) => NotificationManager.error(errorMessage),
            onFinish: () => setLoading(false),
            onSuccess: () => {
              NotificationManager.success("Successfully created new termbase");
              setIsComplete(true);
            }
          })
        }} 
        className="create-page__form"
      >
        {
          /*
          * TODO: Using classes to seperate form elements is much cleaner and easier to maintain
          * We should move all forms to uset his sort of approach
          */
        }
        <div className="create-page__form-group">
          <label htmlFor="name">
            Base Name*:
          </label>
          &nbsp;
          <input
            type="text"
            required
            id="name"
            onChange={(event) => {
              setName(event.target.value);
            }}
            disabled={isComplete}
          />
        </div>
        <div className="create-page__form-group">
          <label htmlFor="language">
            Language*:
          </label>
          &nbsp;
          <LanguageDropdown 
            onChange={(e) => {
              setLanguage(e.target.value)
            }}
            htmlId="language"
            disabled={isComplete}
          />
        </div>
        <div className="create-page__form-group">
          <label htmlFor="description">
            Description:
          </label>
          &nbsp;
          <textarea
            id="description"
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            disabled={isComplete}
          />
        </div>
        <div className="create-page__form-group">
          <input 
            type="submit"
            value="Create"
            className="create-page__form-input"
            disabled={isComplete}
          />
        </div>
      </form>
      {
          isComplete &&
          <button 
            onClick={reloadPage}
            className="create-page__form-input"  
          >
            Create New Termbase
          </button>
        }
    </main>
  )
}

export default CreatePage;