import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ChevronLeft, Info } from 'lucide-react';

const RadioGroup = ({ label, options, name, value, onChange, isDarkMode }) => (
    <div className="space-y-3">
        <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</p>
        <div className="flex flex-wrap gap-6">
            {options.map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={value === option}
                            onChange={(e) => onChange(e.target.value)}
                            className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${value === option
                            ? 'border-orange-500 bg-orange-500'
                            : isDarkMode ? 'border-white/20 group-hover:border-white/40' : 'border-gray-300 group-hover:border-gray-400'
                            }`} />
                        {value === option && (
                            <div className="absolute w-2 h-2 bg-white rounded-full" />
                        )}
                    </div>
                    <span className={`text-[13px] font-bold ${value === option
                        ? (isDarkMode ? 'text-white' : 'text-gray-900')
                        : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                        }`}>{option}</span>
                </label>
            ))}
        </div>
    </div>
);

const HealthAssessmentAdd = () => {
    const { isDarkMode, memberName, id } = useOutletContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        overallHealth: '',
        recentMedicalCheckup: '',
        treatedMedicalCondition: '',
        recentSurgery: '',
        chronicCondition: '',
        physicalLimitations: '',
        recentInjuries: '',
        heartProblems: '',
        highBloodPressure: '',
        asthma: '',
        difficultyBreathing: '',
        jointPain: '',
        muscularInjuries: '',
        regularMedications: '',
        knownAllergies: '',
        stressLevels: '',
        mentalHealthIssues: '',
        dietaryHabits: '',
        dietaryRestrictions: '',
        sleepHours: '',
        sleepDifficulties: '',
        previousExercise: '',
        exerciseTypes: '',
        fitnessGoals: '',
        focusAreas: '',
        steroidUse: '',
        supplementUse: '',
        supplementList: '',
        adverseEffects: ''
    });

    const handleRadioChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isDarkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
                    >
                        <ChevronLeft size={18} />
                        Back
                    </button>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Health Assessment</h2>
                </div>
            </div>

            {/* Form Content */}
            <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                {/* Section Header */}
                <div className="p-6 border-b dark:border-white/10 border-gray-100 flex items-center gap-2">
                    <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>General Health Assessment:</h3>
                </div>

                <div className="p-8 space-y-10">
                    {/* General Health */}
                    <RadioGroup
                        label="How would you describe your current overall health condition ?"
                        options={['Poor', 'Moderate', 'Good']}
                        name="overallHealth"
                        value={formData.overallHealth}
                        onChange={(val) => handleRadioChange('overallHealth', val)}
                        isDarkMode={isDarkMode}
                    />
                    <RadioGroup
                        label="Have you recently undergone any medical assessments or check-ups?"
                        options={['Poor', 'Moderate', 'Good']}
                        name="recentMedicalCheckup"
                        value={formData.recentMedicalCheckup}
                        onChange={(val) => handleRadioChange('recentMedicalCheckup', val)}
                        isDarkMode={isDarkMode}
                    />

                    {/* Medical History */}
                    <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                        <h3 className={`text-lg font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Medical History:</h3>
                        <div className="space-y-10">
                            <RadioGroup
                                label="Are you currently being treated for any medical conditions?"
                                options={['Yes', 'No']}
                                name="treatedMedicalCondition"
                                value={formData.treatedMedicalCondition}
                                onChange={(val) => handleRadioChange('treatedMedicalCondition', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="Have you had any surgeries or medical procedures in the past year?"
                                options={['Yes', 'No']}
                                name="recentSurgery"
                                value={formData.recentSurgery}
                                onChange={(val) => handleRadioChange('recentSurgery', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="Do you have any chronic health conditions we should be aware of?"
                                options={['Yes', 'No']}
                                name="chronicCondition"
                                value={formData.chronicCondition}
                                onChange={(val) => handleRadioChange('chronicCondition', val)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Physical Limitations */}
                    <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                        <h3 className={`text-lg font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Physical Limitations:</h3>
                        <div className="space-y-10">
                            <RadioGroup
                                label="Are there any physical limitations or disabilities that may affect your ability to exercise?"
                                options={['Yes', 'No']}
                                name="physicalLimitations"
                                value={formData.physicalLimitations}
                                onChange={(val) => handleRadioChange('physicalLimitations', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="Have you experienced any recent injuries, sprains, or strains?"
                                options={['Yes', 'No']}
                                name="recentInjuries"
                                value={formData.recentInjuries}
                                onChange={(val) => handleRadioChange('recentInjuries', val)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Cardiovascular Health */}
                    <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                        <h3 className={`text-lg font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cardiovascular Health:</h3>
                        <div className="space-y-10">
                            <RadioGroup
                                label="Do you have any history of heart problems or cardiovascular issues?"
                                options={['Yes', 'No']}
                                name="heartProblems"
                                value={formData.heartProblems}
                                onChange={(val) => handleRadioChange('heartProblems', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="Have you been diagnosed with high blood pressure or any other cardiovascular condition?"
                                options={['Yes', 'No']}
                                name="highBloodPressure"
                                value={formData.highBloodPressure}
                                onChange={(val) => handleRadioChange('highBloodPressure', val)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Respiratory Health */}
                    <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                        <h3 className={`text-lg font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Respiratory Health:</h3>
                        <div className="space-y-10">
                            <RadioGroup
                                label="Do you have asthma or any other respiratory conditions?"
                                options={['Yes', 'No']}
                                name="asthma"
                                value={formData.asthma}
                                onChange={(val) => handleRadioChange('asthma', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="Are you currently experiencing any difficulty breathing or shortness of breath?"
                                options={['Yes', 'No']}
                                name="difficultyBreathing"
                                value={formData.difficultyBreathing}
                                onChange={(val) => handleRadioChange('difficultyBreathing', val)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Joint and Muscular Health */}
                    <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                        <h3 className={`text-lg font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Joint and Muscular Health:</h3>
                        <div className="space-y-10">
                            <RadioGroup
                                label="Do you have any joint pain, arthritis, or other musculoskeletal issues?"
                                options={['Yes', 'No']}
                                name="jointPain"
                                value={formData.jointPain}
                                onChange={(val) => handleRadioChange('jointPain', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="Have you had any recent or recurring injuries to your muscles or joints?"
                                options={['Yes', 'No']}
                                name="muscularInjuries"
                                value={formData.muscularInjuries}
                                onChange={(val) => handleRadioChange('muscularInjuries', val)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Medication and Allergies */}
                    <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                        <h3 className={`text-lg font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Medication and Allergies:</h3>
                        <div className="space-y-10">
                            <RadioGroup
                                label="Are you currently taking any medications on a regular basis?"
                                options={['Yes', 'No']}
                                name="regularMedications"
                                value={formData.regularMedications}
                                onChange={(val) => handleRadioChange('regularMedications', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="Do you have any known allergies to medications, foods, or environmental factors?"
                                options={['Yes', 'No']}
                                name="knownAllergies"
                                value={formData.knownAllergies}
                                onChange={(val) => handleRadioChange('knownAllergies', val)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Stress and Mental Well-being */}
                    <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                        <h3 className={`text-lg font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Stress and Mental Well-being:</h3>
                        <div className="space-y-10">
                            <RadioGroup
                                label="How would you rate your stress levels on a daily basis?"
                                options={['Yes', 'No']}
                                name="stressLevels"
                                value={formData.stressLevels}
                                onChange={(val) => handleRadioChange('stressLevels', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="Are you currently experiencing any mental health issues such as anxiety or depression?"
                                options={['Yes', 'No']}
                                name="mentalHealthIssues"
                                value={formData.mentalHealthIssues}
                                onChange={(val) => handleRadioChange('mentalHealthIssues', val)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Diet and Nutrition */}
                    <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                        <h3 className={`text-lg font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Diet and Nutrition:</h3>
                        <div className="space-y-10">
                            <RadioGroup
                                label="How would you describe your current dietary habits and nutrition?"
                                options={['Poor', 'Moderate', 'Good']}
                                name="dietaryHabits"
                                value={formData.dietaryHabits}
                                onChange={(val) => handleRadioChange('dietaryHabits', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="Do you have any dietary restrictions or preferences that may affect your fitness goals?"
                                options={['Yes', 'No']}
                                name="dietaryRestrictions"
                                value={formData.dietaryRestrictions}
                                onChange={(val) => handleRadioChange('dietaryRestrictions', val)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Sleep Patterns */}
                    <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                        <h3 className={`text-lg font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sleep Patterns:</h3>
                        <div className="space-y-10">
                            <RadioGroup
                                label="How many hours of sleep do you typically get each night?"
                                options={['Less than 6', '6-8', 'More than 8']}
                                name="sleepHours"
                                value={formData.sleepHours}
                                onChange={(val) => handleRadioChange('sleepHours', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="Do you experience any difficulties with sleep quality or insomnia?"
                                options={['Yes', 'No']}
                                name="sleepDifficulties"
                                value={formData.sleepDifficulties}
                                onChange={(val) => handleRadioChange('sleepDifficulties', val)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Previous Exercise Experience */}
                    <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                        <h3 className={`text-lg font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Previous Exercise Experience:</h3>
                        <div className="space-y-10">
                            <RadioGroup
                                label="Have you previously engaged in regular exercise or physical activity?"
                                options={['Yes', 'No']}
                                name="previousExercise"
                                value={formData.previousExercise}
                                onChange={(val) => handleRadioChange('previousExercise', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="What types of exercise or sports have you participated in?"
                                options={['Moderate', 'Open']}
                                name="exerciseTypes"
                                value={formData.exerciseTypes}
                                onChange={(val) => handleRadioChange('exerciseTypes', val)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Fitness Goals */}
                    <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                        <h3 className={`text-lg font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fitness Goals:</h3>
                        <div className="space-y-10">
                            <RadioGroup
                                label="What are your primary goals for joining the gym and pursuing a fitness program?"
                                options={['Weight Loss', 'Muscle Gain', 'General Fitness', 'Other']}
                                name="fitnessGoals"
                                value={formData.fitnessGoals}
                                onChange={(val) => handleRadioChange('fitnessGoals', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="Are there any specific areas of your body you would like to focus on or improve?"
                                options={['Yes', 'No']}
                                name="focusAreas"
                                value={formData.focusAreas}
                                onChange={(val) => handleRadioChange('focusAreas', val)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    {/* Steroid and Supplement Use */}
                    <div className="pt-4 border-t dark:border-white/10 border-gray-100">
                        <h3 className={`text-lg font-black tracking-tight mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Steroid and Supplement Use:</h3>
                        <div className="space-y-10">
                            <RadioGroup
                                label="Have you ever used anabolic steroids or other performance-enhancing drugs?"
                                options={['Yes', 'No']}
                                name="steroidUse"
                                value={formData.steroidUse}
                                onChange={(val) => handleRadioChange('steroidUse', val)}
                                isDarkMode={isDarkMode}
                            />
                            <RadioGroup
                                label="Are you currently using any dietary supplements, including protein powders, creatine, or pre-workout supplements?"
                                options={['Yes', 'No']}
                                name="supplementUse"
                                value={formData.supplementUse}
                                onChange={(val) => handleRadioChange('supplementUse', val)}
                                isDarkMode={isDarkMode}
                            />

                            <div className="space-y-3">
                                <p className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>If yes, please list the supplements you are currently taking:</p>
                                <textarea
                                    className={`w-full h-32 rounded-xl p-4 border text-sm outline-none resize-none transition-all ${isDarkMode ? 'bg-[#1a1a1a] border-white/10 text-white focus:border-orange-500' : 'bg-white border-gray-200 focus:border-orange-500 shadow-sm'}`}
                                    placeholder="Enter Supplement Name"
                                    value={formData.supplementList}
                                    onChange={(e) => setFormData(prev => ({ ...prev, supplementList: e.target.value }))}
                                />
                            </div>

                            <RadioGroup
                                label="Have you experienced any adverse effects from the use of supplements or performance-enhancing substances?"
                                options={['Yes', 'No']}
                                name="adverseEffects"
                                value={formData.adverseEffects}
                                onChange={(val) => handleRadioChange('adverseEffects', val)}
                                isDarkMode={isDarkMode}
                            />
                        </div>
                    </div>

                    <div className="pt-10 flex justify-start">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-3 rounded-lg font-black text-sm shadow-xl shadow-orange-500/30 transition-all active:scale-95 uppercase tracking-wider">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthAssessmentAdd;
