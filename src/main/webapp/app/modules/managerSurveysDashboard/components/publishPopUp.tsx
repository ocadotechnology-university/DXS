import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

type Group = {
  id: number;
  name: string;
};

type PublishPopupProps = {
  surveyName: string;
  onCancel: () => void;
  onPublish: (deadline: string, targetGroup: string[]) => Promise<void>;
};

const PublishPopUp: React.FC<PublishPopupProps> = ({ surveyName, onCancel, onPublish }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [targetGroups, setTargetGroups] = useState<number[]>([]);
  const [deadline, setDeadline] = useState('');
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

  const handleTargetGroupChange = event => {
    const { value, checked } = event.target;
    if (checked) {
      setTargetGroups(prevGroups => [...prevGroups, parseInt(value, 10)]);
    } else {
      setTargetGroups(prevGroups => prevGroups.filter(group => group !== parseInt(value, 10)));
    }
  };

  const handlePublish = () => {
    const targetGroupStrings = targetGroups.map(group => String(group));
    onPublish(deadline, targetGroupStrings);
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label htmlFor="targetGroup" style={{ marginBottom: '0.5rem' }}>
              Target group:
            </label>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {groupOptions
                .filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(group => (
                  <div key={group.id}>
                    <input
                      type="checkbox"
                      id={`targetGroup_${group.id}`}
                      value={group.id}
                      checked={targetGroups.includes(group.id)}
                      onChange={handleTargetGroupChange}
                    />
                    <label htmlFor={`targetGroup_${group.id}`}>{group.name}</label>
                  </div>
                ))}
            </div>
            <input
              type="text"
              placeholder="Search group"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              style={{ marginTop: '0.5rem' }}
            />
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
