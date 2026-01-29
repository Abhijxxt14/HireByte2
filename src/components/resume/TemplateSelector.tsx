"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/general-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ResumeTemplate = 'modern' | 'identity';
export type FontSize = 8 | 9 | 10 | 11 | 12 | 14 | 16 | 18;

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onSelectTemplate: (template: ResumeTemplate) => void;
  fontSize?: FontSize;
  onFontSizeChange?: (size: FontSize) => void;
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate, fontSize = 10, onFontSizeChange }: TemplateSelectorProps) {
  const templates = [
    {
      id: 'modern' as ResumeTemplate,
      name: 'Modern Professional',
      description: 'Clean and minimalist design for all industries',
      preview: '/template-modern.svg'
    },
    {
      id: 'identity' as ResumeTemplate,
      name: 'Identity Training',
      description: 'Traditional format with photo and detailed sections',
      preview: '/template-identity.svg'
    }
  ];

  const fontSizes: FontSize[] = [8, 9, 10, 11, 12, 14, 16, 18];

  return (
    <div className="space-y-3 p-4 bg-slate-50/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1">
          Choose Template
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Select a template that best suits your needs
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "relative cursor-pointer transition-all p-3 rounded-lg border-2",
              selectedTemplate === template.id
                ? "border-primary bg-primary/5"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            )}
            onClick={() => onSelectTemplate(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            
            <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-1 text-sm">
              {template.name}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
              {template.description}
            </p>
          </div>
        ))}
      </div>
      
      {onFontSizeChange && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Font Size:
            </label>
            <Select value={fontSize.toString()} onValueChange={(value) => onFontSizeChange(parseInt(value) as FontSize)}>
              <SelectTrigger className="h-8 w-20 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map((size) => (
                  <SelectItem key={size} value={size.toString()} className="text-xs">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-slate-500 dark:text-slate-400">pt</span>
          </div>
        </div>
      )}
    </div>
  );
}
