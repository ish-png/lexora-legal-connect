import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Trash2,
  Download,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { DocumentItem } from "../../types.ts";
import { api } from "../../services/api.ts";
import { useToast } from "../../context/ToastContext.tsx";

interface DocumentManagerProps {
  caseId?: string;
  consultationId?: string;
  canUpload?: boolean;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  caseId,
  consultationId,
  canUpload = true,
}) => {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // Form states
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("Agreement / Contract");
  const [fileSize] = useState<string>("1.4 MB");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await api.getDocuments(caseId);
      if (res.success) {
        setDocuments(res.documents);
      }
    } catch (err: any) {
      console.error("Failed to load documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [caseId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) {
      showToast("Please enter a document name.", "error");
      return;
    }

    setIsUploading(true);
    try {
      const res = await api.uploadDocument({
        caseId,
        consultationId,
        fileName: fileName.trim(),
        fileType,
        fileSize,
      });

      if (res.success) {
        showToast("Document attached successfully.", "success");
        setFileName("");
        setShowUploadModal(false);
        await loadDocuments();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to upload document.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const res = await api.deleteDocument(id);
      if (res.success) {
        showToast("Document deleted.", "info");
        await loadDocuments();
      }
    } catch (err: any) {
      showToast(err.message || "Failed to delete document.", "error");
    }
  };

  const handleDownload = (doc: DocumentItem) => {
    // Generate a downloadable demo text blob
    const content = `LEGALCONNECT DEMO DOCUMENT\n\nTitle: ${doc.fileName}\nCategory: ${doc.fileType}\nUploaded By: ${doc.clientName} (${doc.uploadedBy})\nDate: ${new Date(doc.createdAt).toLocaleString()}\n\nNote: This is an educational demonstration document. All attorney and client data displayed are demo records.`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.fileName.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded: ${doc.fileName}`, "info");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-blue-600" />
            Case Documents & Filings
          </h3>
          <p className="text-xs text-slate-500">Secure end-to-end encrypted storage for agreements and notices.</p>
        </div>

        {canUpload && (
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Document</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-500">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-medium">No documents uploaded yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Upload notices, agreements, or identification to share with the attorney.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Uploaded By</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr key={doc._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                    <div>
                      <div>{doc.fileName}</div>
                      <span className="text-[10px] text-slate-400">{doc.fileSize}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                      {doc.fileType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="capitalize">{doc.uploadedBy}</span> ({doc.clientName})
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h4 className="text-base font-bold text-slate-900 mb-1">Attach Legal Document</h4>
            <p className="text-xs text-slate-500 mb-4">
              Add documents such as lease agreements, court summons, or notices.
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Lease_Agreement_2025.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Classification Type</label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Agreement / Contract">Agreement / Contract</option>
                  <option value="Court Document / Notice">Court Document / Notice</option>
                  <option value="Identification Document">Identification Document</option>
                  <option value="Evidence / Photo">Evidence / Photo</option>
                  <option value="Financial Statement">Financial Statement</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Documents are stored securely and accessible only to you and your assigned attorney.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Save Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
