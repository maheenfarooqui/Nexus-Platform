// src/pages/documents/DocumentsPage.tsx
import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2,Eye, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

// 🆕 Naye conflicts-free signature pad component aur data type ko import kiya
import { DealSignaturePad } from '../../components/dealDocuments/DealSignaturePad';
import { DealDocument } from '../../types';

export const DocumentsPage: React.FC = () => {
  // 🆕 Aapki existing documents list ko naye status parameters ke sath state mein convert kiya
  const [documents, setDocuments] = useState<DealDocument[]>([
    { id: '1', title: 'Pitch Deck 2024.pdf', size: '2.4 MB', uploadedAt: '2026-02-15', status: 'signed', senderName: 'Me (Entrepreneur)', signatureData: 'mock-existing-sign' },
    { id: '2', title: 'Financial Projections.xlsx', size: '1.8 MB', uploadedAt: '2026-02-10', status: 'draft', senderName: 'Me (Entrepreneur)' },
    { id: '3', title: 'Business Plan.docx', size: '3.2 MB', uploadedAt: '2026-02-05', status: 'in-review', senderName: 'Zeeshan (Investor)' },
    { id: '4', title: 'Market Research.pdf', size: '5.1 MB', uploadedAt: '2026-01-28', status: 'draft', senderName: 'Me (Entrepreneur)' }
  ]);

  // 🆕 Track karne ke liye ke is waqt kaunsa document chamber mein open hai
  const [selectedDoc, setSelectedDoc] = useState<DealDocument | null>(documents[2]); // Default 'Business Plan' open hoga

  // 🆕 Real upload action simulator (Jo click par status: 'draft' ke sath list mein naya document add karega)
  const handleMockUpload = () => {
    const mockFileNames = ['NDA_Alpha_Partners.pdf', 'Shareholder_Agreement_v2.pdf', 'Safe_Agreement.pdf'];
    const randomName = mockFileNames[Math.floor(Math.random() * mockFileNames.length)];

    const newDoc: DealDocument = {
      id: String(Date.now()),
      title: randomName,
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      senderName: 'Me (Entrepreneur)'
    };

    setDocuments([newDoc, ...documents]);
    setSelectedDoc(newDoc);
  };

  // 🆕 Signature Pad se base64 signature image accept karke data update karne wala function
  const handleSignatureSave = (signatureUrl: string) => {
    if (!selectedDoc) return;

    const updatedDocs = documents.map(doc => {
      if (doc.id === selectedDoc.id) {
        return { ...doc, status: 'signed' as const, signatureData: signatureUrl };
      }
      return doc;
    });

    setDocuments(updatedDocs);
    setSelectedDoc({ ...selectedDoc, status: 'signed', signatureData: signatureUrl });
  };

  // Helper mapping function for statuses
  const getStatusBadge = (status: DealDocument['status']) => {
    switch (status) {
      case 'signed': return <Badge variant="success">✔️ Signed</Badge>;
      case 'in-review': return <Badge variant="warning">⏳ In Review</Badge>;
      default: return <Badge variant="gray">📝 Draft</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600">Manage, preview, and securely sign your startup's important deal files</p>
        </div>
        
        {/* Click karne par naya template/file mock upload ho jayegi */}
        <Button leftIcon={<Upload size={18} />} onClick={handleMockUpload}>
          Upload Document
        </Button>
      </div>
      
      {/* 3-Column Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Grid Area (1-Column): Storage Metrics */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Storage</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used</span>
                  <span className="font-medium text-gray-900">12.5 GB</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-primary-600 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available</span>
                  <span className="font-medium text-gray-900">7.5 GB</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Access</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 font-medium text-primary-600 rounded-md">
                    📄 Active Chambers
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                    Recent Files
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                    Shared with Me
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Center Grid Area (2-Columns): Upgraded Files Selector */}
        <div className="lg:col-span-2 space-y-2">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">All Contracts & Pitch Files</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition border border-transparent ${
                      selectedDoc?.id === doc.id 
                        ? 'bg-primary-50/60 border-primary-200 shadow-sm' 
                        : 'hover:bg-gray-50 bg-white'
                    }`}
                  >
                    <div className="p-2 bg-primary-50 rounded-lg mr-4">
                      <FileText size={24} className="text-primary-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {doc.title}
                        </h3>
                        {/* Dynamic custom state badges output */}
                        {getStatusBadge(doc.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>Modified {doc.uploadedAt}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="p-1.5" aria-label="Download">
                        <Download size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1.5 text-red-600 hover:text-red-700">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Grid Area (1-Column): Dynamic Document Preview & Signature Processing Pad */}
        <div className="lg:col-span-1">
          {selectedDoc ? (
            <Card className="border border-gray-200 shadow-md">
              <CardHeader className="bg-gray-50 border-b border-gray-100 flex justify-between items-center py-3 px-4">
                <div className="flex items-center space-x-2 min-w-0">
                  <Eye size={16} className="text-gray-500 flex-shrink-0" />
                  <h3 className="font-medium text-gray-900 text-sm truncate">{selectedDoc.title}</h3>
                </div>
              </CardHeader>

              <CardBody className="p-4 space-y-4">
                {/* Simulated Digital Paper Frame Sheet View */}
                <div className="bg-amber-50/30 border border-amber-200/60 rounded-lg p-4 min-h-[180px] relative text-gray-700 text-xs leading-relaxed max-h-[220px] overflow-y-auto font-serif">
                 <h4 className="text-center font-bold uppercase text-gray-900 tracking-tight underline mb-2">
  {selectedDoc.title
    .replace('.pdf', '')
    .replace('.xlsx', '')
    .replace('.docx', '')
    .replace(/_/g, ' ')}
</h4>
                  <p className="text-[9px] font-sans text-gray-400 text-center mb-2">Reference Secure Key ID: {selectedDoc.id}</p>
                  <p className="mb-2">This standard memorandum profile highlights legal operation terms binding <span className="font-semibold">{selectedDoc.senderName}</span> and active seed stakeholders during strategic venture integrations.</p>
                  <p>All active participants confirm that electronic signatures generated inside this platform securely fulfill regulatory validation standards.</p>
                  
                  {/* Real-time canvas raw image rendering path */}
                  {selectedDoc.signatureData && (
                    <div className="pt-3 mt-3 border-t border-dashed border-gray-300 flex justify-end">
                      <div className="text-center">
                        {selectedDoc.signatureData === 'mock-existing-sign' ? (
                          <div className="text-[13px] font-cursive italic font-semibold text-gray-800 border-b border-gray-900 px-2">
                            {selectedDoc.senderName}
                          </div>
                        ) : (
                          <img 
                            src={selectedDoc.signatureData} 
                            alt="E-Signature" 
                            className="max-h-10 object-contain mx-auto bg-transparent border-b border-gray-900"
                          />
                        )}
                        <p className="text-[8px] font-sans font-medium text-green-600 mt-0.5">🔒 Verified via Nexus Chamber</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conditional Flow: Agar signed nahi hai to drawing element open hoga warna secured notice dikhega */}
                {selectedDoc.status !== 'signed' ? (
                  <DealSignaturePad onSave={handleSignatureSave} />
                ) : (
                  <div className="flex items-start space-x-2.5 bg-green-50 text-green-800 border border-green-200 p-3 rounded-xl">
                    <ShieldCheck size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-xs">Contract Fully Executed</h4>
                      <p className="text-[11px] text-green-700 mt-0.5">This item is digitally secured. Encryption logs have been updated successfully.</p>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          ) : (
            <div className="text-center py-12 border rounded-xl bg-gray-50 text-gray-400 text-sm">
              Select any document structure to activate signing pad chamber.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};