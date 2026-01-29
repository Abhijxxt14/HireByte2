"use client";

import React from "react";
import type { Resume } from "@/lib/types/resume-types";
import { Mail, Phone, Linkedin, Github, MapPin } from "lucide-react";

interface IdentityTemplateProps {
  resumeData: Resume;
  sectionOrder?: string[];
  fontSize?: 8 | 9 | 10 | 11 | 12 | 14 | 16 | 18;
}

export function IdentityTemplate({ resumeData, sectionOrder, fontSize = 10 }: IdentityTemplateProps) {
  const defaultSectionOrder = [
    'summary',
    'education',
    'experience',
    'skills',
    'projects',
    'certifications',
    'awards',
    'volunteer',
    'languages'
  ];
  
  // Font size mappings - using actual pt sizes
  const baseFontSize = fontSize;
  const headingSize = `text-[${baseFontSize}px]`;
  const contentSize = `text-[${Math.max(baseFontSize - 1, 7)}px]`;
  const titleSize = `text-[${Math.max(baseFontSize - 2, 6)}px]`;
  const nameSize = baseFontSize >= 12 ? 'text-2xl' : baseFontSize >= 10 ? 'text-xl' : 'text-lg';
  
  const fs = {
    heading: headingSize,
    content: contentSize,
    title: titleSize,
    name: nameSize
  };
  
  const hiddenSections = resumeData.hiddenSections || [];
  const sections = (sectionOrder?.filter(s => s !== 'personal-info' && s !== 'job-description' && !hiddenSections.includes(s)) || defaultSectionOrder)
    .filter(s => !hiddenSections.includes(s));

  const ensureUrlScheme = (url: string) => {
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) return `https://${url}`;
    return url;
  };

  const renderSectionById = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        return resumeData.summary ? (
          <section key="summary" className="mb-3">
            <h2 className={`${fs.heading} font-bold uppercase mb-1.5`}>
              CAREER SUMMARY
            </h2>
            <p className={`${fs.content} leading-relaxed text-black text-justify`}>{resumeData.summary}</p>
          </section>
        ) : null;
      
      case 'education':
        return resumeData.education && resumeData.education.length > 0 ? (
          <section key="education" className="mb-3">
            <h2 className={`${fs.heading} font-bold uppercase mb-1.5`}>
              EDUCATION
            </h2>
            {resumeData.education.map((edu, index) => (
              <div key={edu.id} className="mb-2 relative">
                <div className="flex justify-between items-baseline">
                  <p className={`${fs.content} font-semibold`}>{edu.degree}</p>
                  <p className={`${fs.heading} font-bold`}>{edu.graduationDate}</p>
                </div>
                <p className={`${fs.content} text-slate-700`}>{edu.school} | {edu.location}</p>
                {edu.grade && <p className={`${fs.content} text-slate-700`}>{edu.grade}</p>}
              </div>
            ))}
          </section>
        ) : null;
      
      case 'skills':
        return resumeData.skills && resumeData.skills.length > 0 ? (
          <section key="skills" className="mb-3">
            <h2 className={`${fs.heading} font-bold uppercase mb-1.5`}>
              SKILLS
            </h2>
            <div className="grid grid-cols-3 gap-x-4 gap-y-0.5">
              {resumeData.skills.slice(0, 12).map((skill, index) => (
                <div key={index} className={fs.content}>• {skill}</div>
              ))}
            </div>
          </section>
        ) : null;
      
      case 'experience':
        return resumeData.experience && resumeData.experience.length > 0 ? (
          <section key="experience" className="mb-3">
            <h2 className={`${fs.heading} font-bold uppercase mb-1.5`}>
              WORK EXPERIENCE
            </h2>
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <p className={`${fs.content} font-semibold`}>{exp.jobTitle}</p>
                  <p className={`${fs.content} font-bold`}>{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className={`${fs.content} text-slate-700`}>{exp.company} | {exp.location}</p>
                <div className="mt-0.5">
                  {exp.description.split('\n').slice(0, 3).map((line, i) => 
                    line && <p key={i} className={`${fs.content} text-slate-700`}>• {line.replace(/^- /, '')}</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        ) : null;
      
      case 'projects':
        return resumeData.projects && resumeData.projects.length > 0 ? (
          <section key="projects" className="mb-3">
            <h2 className={`${fs.heading} font-bold uppercase mb-1.5`}>
              PROJECTS
            </h2>
            {resumeData.projects.map((proj, index) => (
              <div key={proj.id} className="mb-2">
                <p className={`${fs.content} font-semibold`}>{proj.name}</p>
                <p className={`${fs.content} text-slate-700`}>{proj.description}</p>
                {proj.link && (
                  <a href={ensureUrlScheme(proj.link)} target="_blank" rel="noopener noreferrer" className={`${fs.title} text-blue-600 hover:underline`}>
                    View
                  </a>
                )}
              </div>
            ))}
          </section>
        ) : null;
      
      case 'certifications':
        return resumeData.certifications && resumeData.certifications.length > 0 ? (
          <section key="certifications" className="mb-3">
            <h2 className={`${fs.heading} font-bold uppercase mb-1.5`}>
              CERTIFICATIONS
            </h2>
            {resumeData.certifications.map((cert, index) => (
              <div key={cert.id} className="mb-0.5">
                <p className={fs.content}>
                  • {cert.name} - {cert.authority} ({cert.date})
                </p>
                {cert.link && (
                  <a href={ensureUrlScheme(cert.link)} target="_blank" rel="noopener noreferrer" className={`${fs.title} text-blue-600 hover:underline ml-3`}>
                    View
                  </a>
                )}
              </div>
            ))}
          </section>
        ) : null;
      
      case 'awards':
        return resumeData.awards && resumeData.awards.length > 0 ? (
          <section key="awards" className="mb-3">
            <h2 className={`${fs.heading} font-bold uppercase mb-1.5`}>
              RANK ACHIEVED
            </h2>
            {resumeData.awards.map((award, index) => (
              <div key={award.id} className="mb-0.5">
                <p className={fs.content}>• {award.name}</p>
                {award.link && (
                  <a href={ensureUrlScheme(award.link)} target="_blank" rel="noopener noreferrer" className={`${fs.title} text-blue-600 hover:underline ml-3`}>
                    View
                  </a>
                )}
              </div>
            ))}

          </section>
        ) : null;
      
      case 'volunteer':
        return resumeData.volunteerExperience && resumeData.volunteerExperience.length > 0 ? (
          <section key="volunteer" className="mb-3">
            <h2 className={`${fs.heading} font-bold uppercase mb-1.5`}>
              VOLUNTEER EXPERIENCE
            </h2>
            {resumeData.volunteerExperience.map((vol, index) => (
              <div key={vol.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <p className={`${fs.content} font-semibold`}>{vol.role}</p>
                  <p className={`${fs.content} font-bold`}>{vol.dates}</p>
                </div>
                <p className={`${fs.content} text-slate-700`}>{vol.organization}</p>
                <p className={`${fs.content} text-slate-700 mt-0.5`}>{vol.description}</p>
              </div>
            ))}
          </section>
        ) : null;
      
      case 'languages':
        return resumeData.languages && resumeData.languages.length > 0 ? (
          <section key="languages" className="mb-3">
            <h2 className={`${fs.heading} font-bold uppercase mb-1.5`}>
              LANGUAGES
            </h2>
            <div className="space-y-0.5">
              {resumeData.languages.map((lang, index) => (
                <p key={lang.id} className={fs.content}>
                  <span className="font-semibold">{lang.name}:</span> {lang.proficiency}
                </p>
              ))}
            </div>
          </section>
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg border border-slate-300 min-h-[842px]">
      {/* Header Section with Photo */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h1 className={`${fs.name} font-bold mb-1`}>{resumeData.personalInfo.name}</h1>
          <div className={`space-y-0.5 ${fs.content}`}>
            <div>Ph. No: +91 {resumeData.personalInfo.phone}</div>
            <div>E-Mail: {resumeData.personalInfo.email}</div>
            <div className="flex items-center gap-4 mt-1">
              {resumeData.personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin className="h-2.5 w-2.5" />
                  <span className="text-[7px]">LINKEDIN</span>
                </div>
              )}
              {resumeData.personalInfo.github && (
                <div className="flex items-center gap-1">
                  <Github className="h-2.5 w-2.5" />
                  <span className="text-[7px]">GITHUB</span>
                </div>
              )}
            </div>

          </div>
        </div>
        
        {/* Photo Placeholder */}
        <div className="w-20 h-24 border border-black flex items-center justify-center text-[10px] text-slate-400 ml-3 flex-shrink-0 overflow-hidden">
          {resumeData.personalInfo.photo ? (
            <img src={resumeData.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span>PHOTO</span>
          )}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-4">
        {sections.map((sectionId) => renderSectionById(sectionId))}
      </div>
    </div>
  );
}
