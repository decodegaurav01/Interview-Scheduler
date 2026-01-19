
import  { useEffect, useState } from "react"
import { Navbar } from '../../components/Navbar'
import { Trash2, Plus, Mail } from 'lucide-react';
import '../../styles/admin/WhitelistCandidate.css'




export default function WhitelistCandidate() {
  const [emails, setEmails] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/whitelist-emails');
      const data = await response.json();
      setEmails(data);
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
      const response = await fetch('/api/whitelist-emails');

      

      const data = await response.json();
      setEmails([...emails, data]);
      setNewEmail('');
      setSuccess(`${newEmail} has been whitelisted`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add email');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEmail = async (id, email) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/whitelist-emails/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete email');
      }

      setEmails(emails.filter((e) => e.id !== id));
      setSuccess(`${email} has been removed`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete email');
    }
  };

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
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteEmail(item.id, item.email)}
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
    </div>
    </>
  );
}
