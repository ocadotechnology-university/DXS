import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

type Group = {
  id: number;
  name: string;
};

type PublishPopupProps = {
  surveyName: string;
  onCancel: () => void;
  onPublish: (deadline: string, targetGroup: string) => void;
};

const PublishPopUp: React.FC<PublishPopupProps> = ({ surveyName, onCancel, onPublish }) => {
  const [deadline, setDeadline] = useState('');
  const [targetGroup, setTargetGroup] = useState('');
  const [groupOptions, setGroupOptions] = useState<Group[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    fetchGroupOptions(); // Fetch group names when component mounts
  }, []);

  const fetchGroupOptions = async () => {
    try {
      const response = await fetch('/api/groups'); // Replace with your actual API endpoint
      const groups: Group[] = await response.json();
      setGroupOptions(groups);
    } catch (error) {
      console.error('Error fetching group options:', error);
    }
  };

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
  };

  const handleTargetGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetGroup(event.target.value);
  };

  const handlePublish = () => {
    onPublish(deadline, targetGroup);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000); // Hide notification after 3 seconds (3000 ms)
  };

  const handleCancel = () => {
    onCancel();
    setShowNotification(false);
  };

  return (
    <Modal show={true} onHide={handleCancel} dialogClassName="modal-lg">
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
            <select
              id="targetGroup"
              className="form-control"
              value={targetGroup}
              onChange={handleTargetGroupChange}
              style={{ width: '100%' }}
            >
              <option value="">Select a group</option>
              {groupOptions.map(group => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="deadline">Deadline:</label>
            <input type="date" id="deadline" className="form-control" value={deadline} onChange={handleDeadlineChange} />
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
      {showNotification && <div className="notification">Survey &quot;{surveyName}&quot; published successfully!</div>}
    </Modal>
  );
};

export default PublishPopUp;
