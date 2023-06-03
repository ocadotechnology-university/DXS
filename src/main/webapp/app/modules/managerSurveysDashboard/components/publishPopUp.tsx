import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

type PublishPopupProps = {
  surveyName: string;
  onCancel: () => void;
  onPublish: (duration: string, targetGroup: string) => void;
};

const PublishPopUp: React.FC<PublishPopupProps> = ({ surveyName, onCancel, onPublish }) => {
  const [surveyDuration, setSurveyDuration] = useState('');
  const [targetGroup, setTargetGroup] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSurveyDuration(event.target.value);
  };

  const handleTargetGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetGroup(event.target.value);
  };

  const handlePublish = () => {
    onPublish(surveyDuration, targetGroup);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // Ukryj notyfikację po 3 sekundach (3000 ms)
  };

  const handleCancel = () => {
    onCancel();
    setShowNotification(false);
  };

  return (
    <Modal show={true} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Publish Survey</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>Survey name: {surveyName}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '1rem' }}>
            <label htmlFor="targetGroup">Target group:</label>
            <input type="text" id="targetGroup" className="form-control" value={targetGroup} onChange={handleTargetGroupChange} />
          </div>
          <div>
            <label htmlFor="surveyDuration">Survey duration:</label>
            <input type="date" id="surveyDuration" className="form-control" value={surveyDuration} onChange={handleDurationChange} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handlePublish}>
          Publish
        </Button>
      </Modal.Footer>
      {showNotification && (
        <div className="notification">
          Survey {surveyName} published successfully
        </div>
      )}
    </Modal>
  );
};

export default PublishPopUp;
