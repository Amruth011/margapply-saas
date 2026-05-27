"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: {
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  summary: string;
}

export function ResumeUploader() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_URL}/get-profile`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.name) {
            setProfile(data);
          }
        }
      } catch (err) {
        console.error("Failed to load existing profile:", err);
      }
    }
    fetchProfile();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setError(null);
    setSuccessMessage(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMessage(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only. Other file formats are not supported yet.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum supported size is 5MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setProcessingStatus("Uploading resume PDF...");

    const statuses = [
      "Running PDF forensics...",
      "Extracting text streams...",
      "Analyzing experience milestones...",
      "Architecting technical profile...",
      "Finalizing structured persona..."
    ];

    let statusIndex = 0;
    const interval = setInterval(() => {
      if (statusIndex < statuses.length) {
        setProcessingStatus(statuses[statusIndex]);
        setUploadProgress((prev) => Math.min(prev + 15, 90));
        statusIndex++;
      }
    }, 1200);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/upload-resume`, {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.profile) {
        setUploadProgress(100);
        setProcessingStatus("Deconstruction complete!");
        setTimeout(() => {
          setProfile(result.profile);
          setIsUploading(false);
          setSuccessMessage("Your resume has been successfully parsed and persisted!");
        }, 500);
      } else {
        throw new Error(result.error || "Failed parsing the resume.");
      }
    } catch (err: unknown) {
      clearInterval(interval);
      setIsUploading(false);
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred during resume processing.";
      setError(errorMsg);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const triggerReupload = () => {
    setProfile(null);
    setSuccessMessage(null);
    setError(null);
  };

  return (
    <div className="w-full mb-8 select-none">
      {/* State: Uploading / Processing */}
      {isUploading && (
        <div className="w-full rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col items-center justify-center min-h-[300px]">
          <div className="relative flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-emerald-600 animate-spin"></div>
            <Sparkles className="w-8 h-8 text-emerald-600 animate-bounce" />
          </div>
          <h4 className="text-lg font-headline font-black text-slate-900 mb-2">Resume Intelligence Scanner</h4>
          <p className="text-sm font-bold text-emerald-600 animate-pulse mb-6">{processingStatus}</p>
          
          <div className="w-full max-w-xs bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* State: Upload Form (No profile or re-upload requested) */}
      {!isUploading && !profile && (
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`
            w-full rounded-2xl border-2 border-dashed p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] text-center
            transition-all duration-200 bg-white flex flex-col items-center justify-center min-h-[280px] group
            ${isDragActive 
              ? "border-emerald-500 bg-emerald-50/50 shadow-emerald-50/50" 
              : "border-slate-200 hover:border-slate-350 hover:bg-slate-50/30"}
          `}
        >
          <input 
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-105 duration-200 transition-transform">
            <UploadCloud className="w-7 h-7 text-emerald-600" />
          </div>

          <h4 className="text-base font-black text-slate-800 mb-1">
            Upload Your Professional Persona
          </h4>
          <p className="text-xs text-slate-400 max-w-md mb-6 font-label leading-relaxed">
            Drag & drop your resume PDF here or click to browse. MargApply deconstructs your resume into a persistent state, ready to customize matches.
          </p>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={onButtonClick}
            className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/60 rounded-xl cursor-pointer font-bold px-4 h-9 text-xs"
          >
            Choose Resume File
          </Button>

          <span className="text-[10px] text-slate-400 mt-4 font-label">Supports: PDF (Max 5MB)</span>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-xs text-red-650 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* State: Profile View */}
      {!isUploading && profile && (
        <div className="w-full rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Left Column: Personal Card */}
          <div className="p-6 md:w-1/3 bg-slate-50/20 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-100">
                  <User className="w-5.5 h-5.5" />
                </div>
                <span className="text-[9px] font-black font-label uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200/50 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Parsed State
                </span>
              </div>

              <h3 className="text-lg font-headline font-black text-slate-900 leading-tight">
                {profile.name}
              </h3>
              <p className="text-[10px] font-bold text-emerald-650 mt-1 uppercase tracking-widest font-label">Candidate Persona</p>
              
              <div className="flex flex-col gap-2 mt-6">
                {profile.email && (
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>

              {profile.summary && (
                <div className="mt-6 pt-5 border-t border-slate-150">
                  <p className="text-[10px] font-bold font-label uppercase tracking-widest text-slate-450 mb-2">Executive Summary</p>
                  <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border-l-2 border-emerald-500 border border-slate-100/50">
                    &quot;{profile.summary}&quot;
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <Button 
                variant="outline" 
                size="xs" 
                onClick={triggerReupload}
                className="w-full border-slate-200 hover:border-emerald-250 hover:bg-emerald-50/20 hover:text-emerald-700 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-slate-500 font-bold h-9"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update Resume / Profile</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Experience, Skills & Education */}
          <div className="p-6 md:w-2/3 flex flex-col gap-6">
            
            {/* Skills Badges */}
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold font-label uppercase tracking-widest text-slate-450 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Parsed Target Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm transition-colors hover:bg-emerald-100/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Timeline */}
            {profile.experience && profile.experience.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold font-label uppercase tracking-widest text-slate-450 mb-4 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-500" /> Work History Milestones
                </h4>
                <div className="space-y-4">
                  {profile.experience.map((exp, idx) => (
                    <div key={idx} className="relative pl-4 border-l-2 border-emerald-100/60 pb-1 last:pb-0">
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white -left-[6px] top-1 shadow-sm"></div>
                      <div className="flex justify-between items-baseline gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-800">{exp.role}</span>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">{exp.duration}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{exp.company}</p>
                      {exp.description && (
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education History */}
            {profile.education && profile.education.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-[10px] font-bold font-label uppercase tracking-widest text-slate-450 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-500" /> Academic Background
                </h4>
                <div className="flex flex-col gap-2">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs flex-wrap gap-1 bg-slate-50/30 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800">{edu.degree}</span>
                        <span className="text-slate-400 mx-1.5">•</span>
                        <span className="text-slate-500 font-semibold text-slate-500">{edu.institution}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Inline success feedback toast */}
      {successMessage && (
        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-2.5 rounded-xl border border-emerald-100 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}
    </div>
  );
}
