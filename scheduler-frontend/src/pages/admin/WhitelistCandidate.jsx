
import { useEffect, useState } from "react"
import { Navbar } from '../../components/Navbar'
import { Trash2, Plus, Mail } from 'lucide-react';
import '../../styles/admin/WhitelistCandidate.css'
import { addWhitelistEmail, deleteWhitelistedEmail, getWhitelistedEmails } from "../../services/adminService";




export default function WhitelistCandidate() {
  const [emails, setEmails] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  


  const fetchEmails = async () => {
    try {
      const response = await getWhitelistedEmails();
      console.log(response)
      setEmails(response);
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      setError('Failed to load whitelist emails');
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleAddEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (!newEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (emails.some((e) => e.email === newEmail)) {
      setError('This email is already whitelisted');
      return;
    }


    setIsSaving(true);

    try {
      const res = await addWhitelistEmail(newEmail);

      if (res) {

        setSuccess(`${newEmail} has been whitelisted`);
        setNewEmail('');
        fetchEmails();

      } else
        setError("Failed to add email");

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add email');
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedUserId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteEmail = async () => {
  try {
    const response = await deleteWhitelistedEmail(selectedUserId);
    
    setSuccess("Email removed successfully"); 
    setEmails((prev) => prev.filter((e) => e.id !== selectedUserId));
  } catch (err) {
   
    setError("Could not delete email"); 
  } finally {
    setShowDeleteModal(false);
    setSelectedUserId(null);
  }
};

   useEffect(() => {
    fetchEmails();
  }, []);

useEffect(() => {
  if (error || success) {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 5000);

    return () => clearTimeout(timer); 
  }
}, [error, success]);

  return (
    <>
      <Navbar role="admin" />
      <div className="whitelist-page">
        <div className="whitelist-container">
          <header className="whitelist-header">
            <h1 className="whitelist-title">Allowed Candidate Emails</h1>
            <p className="whitelist-subtitle">
              Add email addresses of candidates who can book interview slots
            </p>
          </header>

          <div className="whitelist-card">
            <h2 className="card-heading">Add New Email</h2>

            {error && <div className="alert-error">{error}</div>}
            {success && <div className="alert-success">{success}</div>}

            <form onSubmit={handleAddEmail} className="whitelist-form">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="whitelist-input"
                required
              />
              <button type="submit" disabled={isSaving} className="btn-add-email">
                <Plus className="w-4 h-4" />
                {isSaving ? 'Adding...' : 'Add Email'}
              </button>
            </form>
          </div>

          <div className="list-card">
            <div className="list-header">
              <h2 className="card-heading mb-0">
                Whitelisted Emails ({emails.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-b-slate-900"></div>
                <p className="mt-4 text-slate-500">Loading emails...</p>
              </div>
            ) : emails.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No emails whitelisted yet. Add one above to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {emails.map((item) => (
                  <div key={item.id} className="email-item">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-300" />
                      <div>
                        <p className="text-slate-900 font-medium">{item.email}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                        {/* Added {new Date(item.addedAt).toLocaleDateString()} */}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => openDeleteModal(item.id)}
                      className="btn-delete-email"
                      title="Remove Email"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {showDeleteModal && (
          <div className="pop-card">
            <div
              className="pop-overlay"
              onClick={() => setShowDeleteModal(false)}
            />
            <div className="pop-content">
              <h3 className="pop-title">
                Confirm Deletion
              </h3>
              <p className="pop-title-2">
                Are you sure you want to delete this email?
                <br />
                <span className="pop-warning">
                  This action cannot be undone.
                </span>
              </p>
              <div className="pop-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn-confirm-delete"
                  onClick={handleDeleteEmail}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
