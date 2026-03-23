import React from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Globe, 
  ShieldCheck, 
  Trash2, 
  ChevronRight,
  Camera,
  Mail,
  Briefcase,
  Database,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  FolderPlus,
  FolderOpen,
  Save,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';

export const SettingsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = React.useState('profile');
  const [isImporting, setIsImporting] = React.useState(false);
  const [importMessage, setImportMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Database Management State
  const [dbStatus, setDbStatus] = React.useState<{ exists: boolean, path: string } | null>(null);
  const [folderPath, setFolderPath] = React.useState('');
  const [fileName, setFileName] = React.useState('projects.xlsx');
  const [isCreating, setIsCreating] = React.useState(false);

  React.useEffect(() => {
    fetchDbStatus();
  }, []);

  const fetchDbStatus = async () => {
    try {
      const response = await fetch('/api/database-status');
      const data = await response.json();
      setDbStatus(data);
      // Initialize folder path from current path
      if (data.path) {
        const lastSlash = data.path.lastIndexOf('/');
        if (lastSlash !== -1) {
          setFolderPath(data.path.substring(0, lastSlash));
          setFileName(data.path.substring(lastSlash + 1));
        }
      }
    } catch (error) {
      console.error('Failed to fetch DB status:', error);
    }
  };

  const handleCreateExcel = async () => {
    setIsCreating(true);
    setImportMessage(null);
    try {
      const response = await fetch('/api/create-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath, fileName }),
      });
      const data = await response.json();
      if (response.ok) {
        setImportMessage({ type: 'success', text: data.message });
        fetchDbStatus();
      } else {
        throw new Error(data.error || 'Failed to create Excel file');
      }
    } catch (error: any) {
      setImportMessage({ type: 'error', text: error.message });
    } finally {
      setIsCreating(false);
      setTimeout(() => setImportMessage(null), 5000);
    }
  };

  const handleSetPath = async () => {
    setImportMessage(null);
    try {
      const fullPath = `${folderPath}/${fileName}`.replace(/\/+/g, '/');
      const response = await fetch('/api/set-database-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: fullPath }),
      });
      const data = await response.json();
      if (response.ok) {
        setImportMessage({ type: 'success', text: 'Database path updated successfully' });
        fetchDbStatus();
      } else {
        throw new Error(data.error || 'Failed to update path');
      }
    } catch (error: any) {
      setImportMessage({ type: 'error', text: error.message });
    } finally {
      setTimeout(() => setImportMessage(null), 5000);
    }
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import-excel', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setImportMessage({ type: 'success', text: `Successfully imported ${result.count} projects!` });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Import failed');
      }
    } catch (error: any) {
      setImportMessage({ type: 'error', text: error.message || 'Failed to import Excel file.' });
    } finally {
      setIsImporting(false);
      // Clear input
      e.target.value = '';
      setTimeout(() => setImportMessage(null), 5000);
    }
  };

  return (
    <div className="px-12 py-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-on-secondary-container mb-2 block">System Configuration</span>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">App <span className="text-on-tertiary-container">Settings</span></h2>
          <p className="mt-3 text-secondary max-w-md font-body leading-relaxed">Customize your architectural environment and personal ritual preferences.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="bg-surface-container-lowest p-2 rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
            {[
              { id: 'profile', label: 'Profile Settings', icon: User },
              { id: 'security', label: 'Account & Security', icon: Lock },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'appearance', label: 'App Appearance', icon: Palette },
              { id: 'language', label: 'Language & Region', icon: Globe },
              { id: 'data-sources', label: 'Data Sources', icon: Database },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  activeSubTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/10' : 'text-secondary hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                <ChevronRight size={16} className={activeSubTab === item.id ? 'text-white/60' : 'text-outline'} />
              </button>
            ))}
          </div>

          <div className="bg-error-container/20 p-6 rounded-2xl border border-error/10">
            <h4 className="text-error font-bold text-sm mb-2 flex items-center gap-2">
              <Trash2 size={16} /> Danger Zone
            </h4>
            <p className="text-xs text-on-surface-variant mb-4">Permanently delete your account and all architectural data. This action cannot be undone.</p>
            <button className="w-full py-2.5 bg-error text-white rounded-xl text-xs font-bold hover:bg-error/90 transition-colors">Delete Account</button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 space-y-8">
          {activeSubTab === 'profile' && (
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
              <div className="flex items-center gap-8 mb-10">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-low shadow-md">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3YTgs4AcgGlK1_rVf7mpAGaqIfalfbxfHxSmuyI_0z8o8Vid91INABheleS-8uoaZPArCxzVaeFIefrjanntRAhfaWuBsnxOJwdxPkEngLcwlDwcRQWFNXqB8-LK8tjz9PhJg33bNQWGfpdrihTYWzRdupQid91iTFJbK9kjaUyQpFW8nAGpYkuPSkbPz2ikDQW9iSInzbY1EreaG6HNorl4m92Za8VakALph0DwgcC6ghCSREwbKcE5J2sA9UgvfKIhVQSGkXQcS" 
                      alt="Julian" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-on-surface">Julian Pierce</h3>
                  <p className="text-secondary font-medium">Senior Architectural Designer</p>
                  <div className="flex gap-2 mt-3">
                    <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold rounded uppercase tracking-wider">Pro Plan</span>
                    <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded uppercase tracking-wider">Verified</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
                    <input type="text" defaultValue="Julian Pierce" className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
                    <input type="email" defaultValue="julian.p@architect.io" className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Professional Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
                    <input type="text" defaultValue="Senior Architectural Designer" className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Timezone</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
                    <select className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 appearance-none">
                      <option>Pacific Standard Time (PST)</option>
                      <option>Eastern Standard Time (EST)</option>
                      <option>Greenwich Mean Time (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-3">
                <button className="px-6 py-2.5 text-sm font-bold text-secondary hover:text-primary transition-colors">Discard Changes</button>
                <button className="px-8 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all">Save Profile</button>
              </div>
            </div>
          )}

          {activeSubTab === 'data-sources' && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">Database Management</h3>
                    <p className="text-xs text-secondary mt-1">Configure the location of your architectural Excel database.</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <Database size={24} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">Folder Path</label>
                      <div className="relative">
                        <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
                        <input 
                          type="text" 
                          value={folderPath} 
                          onChange={(e) => setFolderPath(e.target.value)}
                          placeholder="e.g. /app/data"
                          className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest ml-1">File Name</label>
                      <div className="relative">
                        <FileSpreadsheet className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
                        <input 
                          type="text" 
                          value={fileName} 
                          onChange={(e) => setFileName(e.target.value)}
                          placeholder="projects.xlsx"
                          className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/10" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={handleSetPath}
                      className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-low text-on-surface rounded-xl text-xs font-bold hover:bg-surface-container-high transition-all"
                    >
                      <Save size={14} /> Update Path
                    </button>
                    {!dbStatus?.exists && (
                      <button 
                        onClick={handleCreateExcel}
                        disabled={isCreating}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all disabled:opacity-50"
                      >
                        {isCreating ? <Loader2 size={14} className="animate-spin" /> : <FolderPlus size={14} />}
                        Create New Excel
                      </button>
                    )}
                    <button 
                      onClick={fetchDbStatus}
                      className="flex items-center gap-2 px-4 py-2.5 text-secondary hover:text-primary transition-colors"
                    >
                      <RefreshCw size={14} /> Refresh Status
                    </button>
                  </div>

                  {dbStatus && (
                    <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${dbStatus.exists ? 'bg-emerald-500' : 'bg-error'}`}></div>
                          <span className="text-xs font-bold">{dbStatus.exists ? 'Connected' : 'File Not Found'}</span>
                        </div>
                        <span className="text-[10px] font-mono text-outline truncate max-w-xs">{dbStatus.path}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">Import Data</h3>
                    <p className="text-xs text-secondary mt-1">Overwrite current database with external files.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10 flex items-center justify-between group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-on-tertiary-container shadow-sm group-hover:scale-110 transition-transform">
                        <FileSpreadsheet size={24} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Excel Local Database</p>
                        <p className="text-xs text-secondary">Import projects from a local .xlsx or .csv file.</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <input 
                        type="file" 
                        accept=".xlsx, .xls, .csv" 
                        onChange={handleExcelImport}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        disabled={isImporting}
                      />
                      <button 
                        className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                        disabled={isImporting}
                      >
                        {isImporting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        {isImporting ? 'Importing...' : 'Import File'}
                      </button>
                    </div>
                  </div>

                  {importMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl flex items-center gap-3 ${
                        importMessage.type === 'success' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {importMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                      <span className="text-xs font-bold">{importMessage.text}</span>
                    </motion.div>
                  )}

                  <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10 flex items-center justify-between opacity-50 grayscale cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-on-tertiary-container shadow-sm">
                        <Globe size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Cloud Sync (Coming Soon)</p>
                        <p className="text-xs text-secondary">Connect to Google Drive or Dropbox.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Locked</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
                <h4 className="text-sm font-bold mb-4">Import Instructions</h4>
                <ul className="space-y-3">
                  {[
                    "Ensure your Excel file has a sheet named 'Projects'.",
                    "The first row must contain headers: 'name', 'description', 'status'.",
                    "Optional columns: 'id', 'createdAt'.",
                    "Importing will overwrite your current local project data."
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-secondary">
                      <div className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeSubTab !== 'data-sources' && activeSubTab !== 'profile' && (
            <div className="bg-surface-container-lowest p-12 rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center text-outline mb-4">
                <Settings size={32} />
              </div>
              <h3 className="text-xl font-bold text-on-surface">{activeSubTab.charAt(0).toUpperCase() + activeSubTab.slice(1)} Settings</h3>
              <p className="text-sm text-secondary max-w-xs mt-2">This module is currently being architected. Please check back in the next ritual.</p>
            </div>
          )}

          {activeSubTab === 'profile' && (
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Security & Privacy</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-on-tertiary-container shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Two-Factor Authentication</p>
                    <p className="text-xs text-secondary">Add an extra layer of security to your ritual.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-on-tertiary-container shadow-sm">
                    <Lock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Password Management</p>
                    <p className="text-xs text-secondary">Last updated 3 months ago.</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-primary hover:underline">Change Password</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
};
