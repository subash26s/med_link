import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../../contexts/PatientContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ProgressBar, CustomCheckbox, StepTitle } from '../../components/patient/WizardUI';
import VoiceAssistant from '../../components/patient/VoiceAssistant';
import {
    User, Calendar, Smartphone, ChevronLeft, ChevronRight,
    Thermometer, Heart, Activity, Droplets, HeartPulse,
    FileUp, CheckCircle, Info, Stethoscope, ClipboardList
} from 'lucide-react';

const IntakeForm = () => {
    const { patientData, updatePatientData } = usePatient();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 6;

    const nextStep = () => currentStep < totalSteps ? setCurrentStep(c => c + 1) : navigate('/patient/review');
    const prevStep = () => currentStep > 1 ? setCurrentStep(c => c - 1) : navigate('/patient/start');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        updatePatientData({ [name]: type === 'checkbox' ? checked : value });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 flex flex-col items-center font-sans">
            <div className="max-w-4xl w-full">
                {/* Header Info */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-xl text-white">
                            <Stethoscope size={24} />
                        </div>
                        <span className="font-black text-slate-900 text-xl">{t('medicare_ai')}</span>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 font-bold text-slate-500">
                        {patientData.patient_id}
                    </div>
                </div>

                <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

                <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-50 border border-slate-100 p-10 md:p-14 min-h-[600px] flex flex-col justify-between animate-in fade-in slide-in-from-right-8 duration-500">

                    <div className="flex-1">
                        {/* STEP 1: BASIC DETAILS */}
                        {currentStep === 1 && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <StepTitle title={t('basic_info_title')} subtitle={t('basic_info_subtitle')} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">{t('full_name')}</label>
                                        <div className="relative">
                                            <User className="absolute left-5 top-5 text-slate-400" size={24} />
                                            <input name="name" value={patientData.name} onChange={handleInputChange} className="w-full text-xl p-5 pl-14 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none font-bold" placeholder="e.g. John Doe" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">{t('phone_number')}</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-5 top-5 text-slate-400" size={24} />
                                            <input name="phone" value={patientData.phone} onChange={handleInputChange} className="w-full text-xl p-5 pl-14 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none font-bold" placeholder="+1 (555) 000-0000" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">{t('age')}</label>
                                        <input name="age" type="number" value={patientData.age} onChange={handleInputChange} className="w-full text-xl p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none font-bold" placeholder="30" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">{t('gender')}</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {[t('male'), t('female'), t('other')].map(g => (
                                                <button key={g} onClick={() => updatePatientData({ gender: g })} className={`p-4 rounded-xl font-bold transition-all ${patientData.gender === g ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: VOICE SYMPTOM INPUT */}
                        {currentStep === 2 && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <StepTitle title={t('voice_diagnosis_title')} subtitle={t('voice_diagnosis_subtitle')} />
                                <VoiceAssistant onTranscript={(txt) => updatePatientData({ symptoms: txt, transcribed_text: txt })} />
                                <div className="space-y-2 pt-4">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">{t('confirm_symptoms')}</label>
                                    <textarea name="symptoms" value={patientData.symptoms} onChange={handleInputChange} className="w-full text-lg p-6 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none font-medium min-h-[150px]" placeholder="Summary of symptoms will appear here..." />
                                </div>
                            </div>
                        )}

                        {/* STEP 3: SYMPTOM CHECKLIST */}
                        {currentStep === 3 && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <StepTitle title={t('symptom_checklist_title')} subtitle={t('symptom_checklist_subtitle')} />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <CustomCheckbox label={t('chest_pain')} checked={patientData.symptom_chest_pain} onChange={(v) => updatePatientData({ symptom_chest_pain: v })} icon={HeartPulse} />
                                    <CustomCheckbox label={t('fever')} checked={patientData.symptom_fever} onChange={(v) => updatePatientData({ symptom_fever: v })} icon={Thermometer} />
                                    <CustomCheckbox label={t('breathing_difficulty')} checked={patientData.symptom_breathing_difficulty} onChange={(v) => updatePatientData({ symptom_breathing_difficulty: v })} icon={Activity} />
                                    <CustomCheckbox label={t('cough')} checked={patientData.symptom_cough} onChange={(v) => updatePatientData({ symptom_cough: v })} icon={Info} />
                                    <CustomCheckbox label={t('headache')} checked={patientData.symptom_headache} onChange={(v) => updatePatientData({ symptom_headache: v })} icon={Activity} />
                                    <CustomCheckbox label={t('dizziness')} checked={patientData.symptom_dizziness} onChange={(v) => updatePatientData({ symptom_dizziness: v })} icon={Activity} />
                                    <CustomCheckbox label={t('vomiting')} checked={patientData.symptom_vomiting} onChange={(v) => updatePatientData({ symptom_vomiting: v })} icon={Info} />
                                </div>
                                <div className="pt-8 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xl font-black text-slate-800 uppercase tracking-widest">{t('pain_level')}: {patientData.pain_level}/10</label>
                                    </div>
                                    <input type="range" min="0" max="10" step="1" value={patientData.pain_level} onChange={(e) => updatePatientData({ pain_level: parseInt(e.target.value) })} className="w-full h-4 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                    <div className="flex justify-between text-sm font-bold text-slate-400 px-1">
                                        <span>{t('no_pain')}</span>
                                        <span>{t('moderate')}</span>
                                        <span className="text-red-500">{t('unbearable')}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: VITALS ENTRY */}
                        {currentStep === 4 && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <StepTitle title={t('vital_signs_title')} subtitle={t('vital_signs_subtitle')} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-6">
                                        <div className="bg-red-100 p-4 rounded-2xl text-red-600"><Thermometer /></div>
                                        <div className="flex-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">{t('temperature')} (°C)</label>
                                            <input name="temperature" type="number" step="0.1" value={patientData.temperature} onChange={handleInputChange} className="w-full text-2xl font-black bg-transparent outline-none" placeholder="36.5" />
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-6">
                                        <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><Activity /></div>
                                        <div className="flex-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">{t('oxygen')} (%)</label>
                                            <input name="spo2" type="number" value={patientData.spo2} onChange={handleInputChange} className="w-full text-2xl font-black bg-transparent outline-none" placeholder="98" />
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-6">
                                        <div className="bg-green-100 p-4 rounded-2xl text-green-600"><HeartPulse /></div>
                                        <div className="flex-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">{t('heart_rate')} (BPM)</label>
                                            <input name="heart_rate" type="number" value={patientData.heart_rate} onChange={handleInputChange} className="w-full text-2xl font-black bg-transparent outline-none" placeholder="72" />
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-6">
                                        <div className="bg-purple-100 p-4 rounded-2xl text-purple-600"><Droplets /></div>
                                        <div className="flex-1 flex gap-2 items-end">
                                            <div className="flex-1">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">{t('blood_pressure_sys_dia')}</label>
                                                <div className="flex items-center gap-2">
                                                    <input name="blood_pressure_systolic" type="number" value={patientData.blood_pressure_systolic} onChange={handleInputChange} className="w-20 text-2xl font-black bg-transparent outline-none text-center" placeholder="120" />
                                                    <span className="text-2xl text-slate-300">/</span>
                                                    <input name="blood_pressure_diastolic" type="number" value={patientData.blood_pressure_diastolic} onChange={handleInputChange} className="w-20 text-2xl font-black bg-transparent outline-none text-center" placeholder="80" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: MEDICAL HISTORY */}
                        {currentStep === 5 && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <StepTitle title={t('medical_history_title')} subtitle={t('medical_history_subtitle')} />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <CustomCheckbox label={t('diabetes')} checked={patientData.diabetes} onChange={(v) => updatePatientData({ diabetes: v })} />
                                    <CustomCheckbox label={t('hypertension')} checked={patientData.hypertension} onChange={(v) => updatePatientData({ hypertension: v })} />
                                    <CustomCheckbox label={t('heart_disease')} checked={patientData.heart_disease} onChange={(v) => updatePatientData({ heart_disease: v })} />
                                    <CustomCheckbox label={t('asthma')} checked={patientData.asthma} onChange={(v) => updatePatientData({ asthma: v })} />
                                    <CustomCheckbox label={t('pregnant')} checked={patientData.pregnant} onChange={(v) => updatePatientData({ pregnant: v })} />
                                    <CustomCheckbox label={t('smoker')} checked={patientData.smoker} onChange={(v) => updatePatientData({ smoker: v })} />
                                </div>
                                <div className="space-y-6 pt-4">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">{t('current_medications')}</label>
                                            <textarea name="current_medications" value={patientData.current_medications} onChange={handleInputChange} className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" rows="2" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">{t('allergies')}</label>
                                            <textarea name="allergies" value={patientData.allergies || ''} onChange={handleInputChange} className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" rows="2" placeholder="e.g. Penicillin, Peanuts" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">{t('chronic_history')}</label>
                                            <textarea name="chronic_disease_history" value={patientData.chronic_disease_history} onChange={handleInputChange} className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" rows="2" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">{t('family_history')}</label>
                                            <textarea name="family_medical_history" value={patientData.family_medical_history} onChange={handleInputChange} className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" rows="2" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 6: VISIT & REPORTS */}
                        {currentStep === 6 && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <StepTitle title={t('final_details_title')} subtitle={t('final_details_subtitle')} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('visit_purpose')}</label>
                                        <select name="visit_type" value={patientData.visit_type} onChange={handleInputChange} className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 text-xl font-black outline-none appearance-none">
                                            <option value="OPD">{t('opd')}</option>
                                            <option value="Emergency">{t('emergency')}</option>
                                            <option value="Follow-up">{t('follow_up')}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('insurance_provider')}</label>
                                        <input name="insurance_provider" value={patientData.insurance_provider} onChange={handleInputChange} className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 text-xl font-bold outline-none" placeholder="e.g. Aetna, Blue Cross" />
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <div className="bg-blue-600 p-12 rounded-[40px] text-white flex flex-col items-center gap-6 relative overflow-hidden group cursor-pointer shadow-2xl shadow-blue-200">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><FileUp size={120} /></div>
                                        <FileUp size={60} strokeWidth={2.5} />
                                        <div className="text-center">
                                            <h3 className="text-2xl font-black mb-1">{t('upload_reports')}</h3>
                                            <p className="text-blue-200 font-medium">{t('upload_subtitle')}</p>
                                        </div>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" multiple onChange={(e) => console.log(e.target.files)} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FOOTER NAVIGATION */}
                    <div className="pt-12 flex justify-between items-center px-2">
                        <button onClick={prevStep} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xl transition-colors">
                            <ChevronLeft size={30} strokeWidth={3} /> {t('back')}
                        </button>
                        <button onClick={nextStep} className="bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-[25px] shadow-2xl shadow-slate-300 font-black text-2xl transition-all flex items-center gap-4 group active:scale-95">
                            {currentStep === totalSteps ? t('review_final') : t('next_step')} <ChevronRight size={32} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntakeForm;
