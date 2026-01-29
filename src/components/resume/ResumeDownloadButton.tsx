'use client';

import { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { Resume } from '@/lib/types/resume-types';

interface ResumeDownloadButtonProps {
  resumeData: Resume;
  sectionOrder?: string[];
}

// Import PDF components dynamically
let PDFDownloadLink: any = null;
let ResumePDF: any = null;
let IdentityTemplatePDF: any = null;

if (typeof window !== 'undefined') {
  import('@react-pdf/renderer').then((mod) => {
    PDFDownloadLink = mod.PDFDownloadLink;
  });
  import('@/components/resume/ResumePDF').then((mod) => {
    ResumePDF = mod.ResumePDF;
  });
  import('@/components/resume/IdentityTemplatePDF').then((mod) => {
    IdentityTemplatePDF = mod.IdentityTemplatePDF;
  });
}

export const ResumeDownloadButton = memo(function ResumeDownloadButton({ 
  resumeData, 
  sectionOrder 
}: ResumeDownloadButtonProps) {
  const [isReady, setIsReady] = useState(false);
  const [isComponentsLoaded, setIsComponentsLoaded] = useState(false);

  const handleClick = useCallback(async () => {
    if (!isComponentsLoaded) {
      // Load components
      const [pdfMod, resumePDFMod, identityPDFMod] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/resume/ResumePDF'),
        import('@/components/resume/IdentityTemplatePDF')
      ]);
      PDFDownloadLink = pdfMod.PDFDownloadLink;
      ResumePDF = resumePDFMod.ResumePDF;
      IdentityTemplatePDF = identityPDFMod.IdentityTemplatePDF;
      setIsComponentsLoaded(true);
    }
    setIsReady(true);
  }, [isComponentsLoaded]);

  const fileName = `${resumeData.personalInfo.name?.replace(/\s+/g, '_') || 'resume'}.pdf`;
  const template = resumeData.template || 'modern';
  const PDFComponent = template === 'identity' ? IdentityTemplatePDF : ResumePDF;

  // Only render PDFDownloadLink when user clicks the button and components are loaded
  if (!isReady || !isComponentsLoaded || !PDFDownloadLink || !PDFComponent) {
    return (
      <Button onClick={handleClick} className="gap-2">
        <Download className="h-4 w-4" />
        {isReady && !isComponentsLoaded ? 'Loading...' : 'Prepare Download'}
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<PDFComponent resume={resumeData} sectionOrder={sectionOrder} />}
      fileName={fileName}
      className="inline-block"
    >
      {({ loading }: any) => (
        <Button disabled={loading} className="gap-2">
          <Download className="h-4 w-4" />
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
});

