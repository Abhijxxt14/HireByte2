"use client";

import { Document, Page, Text, View, StyleSheet, Link, Image } from '@react-pdf/renderer';
import { memo } from 'react';
import type { Resume } from '@/lib/types/resume-types';

// Helper function to ensure URL has https://
const ensureHttps = (url: string) => {
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingTop: 25,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  contentTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  name: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  contactItem: {
    fontSize: 8,
    marginBottom: 2,
    color: '#000',
  },
  socialLinks: {
    flexDirection: 'row',
    marginTop: 3,
    marginBottom: 3,
  },
  socialItem: {
    fontSize: 7,
    marginRight: 15,
  },
  photoBox: {
    width: 80,
    height: 90,
    border: '1.5px solid #000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  photoText: {
    fontSize: 10,
    color: '#666',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  sectionContent: {
    fontSize: 8,
    lineHeight: 1.4,
    marginBottom: 2,
    textAlign: 'justify',
  },
  note: {
    fontSize: 7,
    fontStyle: 'italic',
    color: '#333',
    marginTop: 3,
    lineHeight: 1.3,
    textAlign: 'justify',
  },
  bulletPoint: {
    fontSize: 8,
    marginLeft: 8,
    marginBottom: 1.5,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    width: '33%',
    fontSize: 8,
    marginBottom: 1.5,
  },
  yearText: {
    position: 'absolute',
    right: 0,
    fontSize: 9,
    fontWeight: 'bold',
  },
});

interface IdentityTemplatePDFProps {
  resume: Resume;
  sectionOrder?: string[];
}

export const IdentityTemplatePDF = memo(function IdentityTemplatePDF({ resume, sectionOrder }: IdentityTemplatePDFProps) {
  const defaultOrder = [
    'summary',
    'education',
    'skills',
    'experience',
    'projects',
    'certifications',
    'awards',
    'volunteerExperience',
    'languages',
  ];

  const sectionNameMap: Record<string, string> = {
    'summary': 'summary',
    'skills': 'skills',
    'education': 'education',
    'experience': 'experience',
    'projects': 'projects',
    'certifications': 'certifications',
    'awards': 'awards',
    'volunteer': 'volunteerExperience',
    'languages': 'languages',
  };

  const hiddenSections = resume.hiddenSections || [];
  const mappedOrder = sectionOrder 
    ? sectionOrder
        .filter(section => !hiddenSections.includes(section))
        .map(section => sectionNameMap[section] || '')
        .filter(s => s !== '' && s !== 'personalInfo' && s !== 'ats-score' && s !== 'job-description')
    : defaultOrder;

  const order = mappedOrder.length > 0 ? mappedOrder : defaultOrder;

  const renderSection = (sectionType: string) => {
    switch (sectionType) {
      case 'summary':
        return resume.summary ? (
          <View style={styles.section} key="summary">
            <Text style={styles.sectionTitle}>CAREER SUMMARY</Text>
            <Text style={styles.sectionContent}>{resume.summary}</Text>
          </View>
        ) : null;

      case 'education':
        return resume.education && resume.education.length > 0 ? (
          <View style={styles.section} key="education">
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 5 }} wrap={false}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{edu.degree}</Text>
                  <Text style={{ fontSize: 8, color: '#666' }}>{edu.graduationDate}</Text>
                </View>
                <Text style={{ fontSize: 8, color: '#666' }}>
                  {edu.school} | {edu.location}
                </Text>
                {edu.grade && <Text style={{ fontSize: 8, color: '#666' }}>{edu.grade}</Text>}
              </View>
            ))}
          </View>
        ) : null;

      case 'skills':
        return resume.skills && resume.skills.length > 0 ? (
          <View style={styles.section} key="skills">
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsGrid}>
              {resume.skills.slice(0, 12).map((skill, index) => (
                <Text key={index} style={styles.skillItem}>• {skill}</Text>
              ))}
            </View>
          </View>
        ) : null;

      case 'experience':
        return resume.experience && resume.experience.length > 0 ? (
          <View style={styles.section} key="experience">
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {resume.experience.map((exp, index) => (
              <View key={index} style={{ marginBottom: 8 }} wrap={false}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{exp.jobTitle}</Text>
                  <Text style={{ fontSize: 8, color: '#666' }}>
                    {exp.startDate} - {exp.endDate}
                  </Text>
                </View>
                <Text style={{ fontSize: 8, color: '#666' }}>
                  {exp.company} | {exp.location}
                </Text>
                {exp.description && exp.description.split('\n').slice(0, 3).map((line, i) => 
                  line.trim() && (
                    <Text key={i} style={styles.bulletPoint}>
                      • {line.replace(/^- /, '')}
                    </Text>
                  )
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'projects':
        return resume.projects && resume.projects.length > 0 ? (
          <View style={styles.section} key="projects">
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((proj, index) => (
              <View key={index} style={{ marginBottom: 5 }} wrap={false}>
                <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{proj.name}</Text>
                <Text style={{ fontSize: 8, color: '#333' }}>{proj.description}</Text>
                {proj.link && (
                  <Link src={ensureHttps(proj.link)} style={{ fontSize: 7, color: '#0066cc' }}>
                    View
                  </Link>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'certifications':
        return resume.certifications && resume.certifications.length > 0 ? (
          <View style={styles.section} key="certifications">
            <Text style={styles.sectionTitle}>Certifications</Text>
            {resume.certifications.map((cert, index) => (
              <View key={index} wrap={false}>
                <Text style={styles.bulletPoint}>
                  • {cert.name} - {cert.authority} ({cert.date})
                </Text>
                {cert.link && (
                  <Link src={ensureHttps(cert.link)} style={{ fontSize: 7, color: '#0066cc', marginLeft: 15 }}>
                    View
                  </Link>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'awards':
        return resume.awards && resume.awards.length > 0 ? (
          <View style={styles.section} key="awards">
            <Text style={styles.sectionTitle}>Rank Achieved</Text>
            {resume.awards.map((award, index) => (
              <View key={index} wrap={false}>
                <Text style={styles.bulletPoint}>• {award.name}</Text>
                {award.link && (
                  <Link src={ensureHttps(award.link)} style={{ fontSize: 7, color: '#0066cc', marginLeft: 15 }}>
                    View
                  </Link>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'volunteerExperience':
        return resume.volunteerExperience && resume.volunteerExperience.length > 0 ? (
          <View style={styles.section} key="volunteerExperience">
            <Text style={styles.sectionTitle}>Volunteer Experience</Text>
            {resume.volunteerExperience.map((vol, index) => (
              <View key={index} style={{ marginBottom: 5 }} wrap={false}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{vol.role}</Text>
                  <Text style={{ fontSize: 8, color: '#666' }}>{vol.dates}</Text>
                </View>
                <Text style={{ fontSize: 8, color: '#666' }}>{vol.organization}</Text>
                {vol.description && <Text style={{ fontSize: 8 }}>{vol.description}</Text>}
              </View>
            ))}
          </View>
        ) : null;

      case 'languages':
        return resume.languages && resume.languages.length > 0 ? (
          <View style={styles.section} key="languages">
            <Text style={styles.sectionTitle}>Languages</Text>
            {resume.languages.map((lang, index) => (
              <Text key={index} style={styles.sectionContent}>
                <Text style={{ fontWeight: 'bold' }}>{lang.name}:</Text> {lang.proficiency}
              </Text>
            ))}
          </View>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{resume.personalInfo.name}</Text>
            <Text style={styles.contactItem}>Ph. No: +91 {resume.personalInfo.phone}</Text>
            <Text style={styles.contactItem}>E-Mail: {resume.personalInfo.email}</Text>
            {resume.personalInfo.linkedin && (
              <Link src={ensureHttps(resume.personalInfo.linkedin)} style={{ fontSize: 8, color: '#0066cc', marginTop: 2 }}>
                LinkedIn Profile
              </Link>
            )}
            {resume.personalInfo.github && (
              <Link src={ensureHttps(resume.personalInfo.github)} style={{ fontSize: 8, color: '#0066cc', marginTop: 2 }}>
                GitHub Profile
              </Link>
            )}
          </View>
          <View style={styles.photoBox}>
            {resume.personalInfo.photo ? (
              <Image src={resume.personalInfo.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Text style={styles.photoText}>PHOTO</Text>
            )}
          </View>
        </View>

        {/* Sections */}
        {order.map((sectionType) => renderSection(sectionType))}
      </Page>
    </Document>
  );
});
