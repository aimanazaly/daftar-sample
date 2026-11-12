import { ChemicalItem, LabProfile, LabScheduleItem, SampleRecord, TestParameter } from '../types/lims';
import { DEFAULT_LAB_PROFILE, INITIAL_CHEMICALS, INITIAL_PARAMETERS, INITIAL_SCHEDULE, INITIAL_SAMPLES } from '../data/initialData';

const SAMPLES_KEY = 'rubberlab_lims_samples_v2';
const PARAMS_KEY = 'rubberlab_lims_params_v2';
const CHEMICALS_KEY = 'rubberlab_lims_chemicals_v2';
const SCHEDULE_KEY = 'rubberlab_lims_schedule_v2';
const PROFILE_KEY = 'rubberlab_lims_profile_v2';

export const loadStoredSamples = (): SampleRecord[] => {
  try {
    const data = localStorage.getItem(SAMPLES_KEY);
    return data ? JSON.parse(data) : INITIAL_SAMPLES;
  } catch (e) {
    console.error('Error loading samples:', e);
    return INITIAL_SAMPLES;
  }
};

export const saveStoredSamples = (samples: SampleRecord[]) => {
  try {
    localStorage.setItem(SAMPLES_KEY, JSON.stringify(samples));
  } catch (e) {
    console.error('Error saving samples:', e);
  }
};

export const loadStoredParameters = (): TestParameter[] => {
  try {
    const data = localStorage.getItem(PARAMS_KEY);
    return data ? JSON.parse(data) : INITIAL_PARAMETERS;
  } catch (e) {
    console.error('Error loading parameters:', e);
    return INITIAL_PARAMETERS;
  }
};

export const saveStoredParameters = (params: TestParameter[]) => {
  try {
    localStorage.setItem(PARAMS_KEY, JSON.stringify(params));
  } catch (e) {
    console.error('Error saving parameters:', e);
  }
};

export const loadStoredChemicals = (): ChemicalItem[] => {
  try {
    const data = localStorage.getItem(CHEMICALS_KEY);
    return data ? JSON.parse(data) : INITIAL_CHEMICALS;
  } catch (e) {
    console.error('Error loading chemicals:', e);
    return INITIAL_CHEMICALS;
  }
};

export const saveStoredChemicals = (chemicals: ChemicalItem[]) => {
  try {
    localStorage.setItem(CHEMICALS_KEY, JSON.stringify(chemicals));
  } catch (e) {
    console.error('Error saving chemicals:', e);
  }
};

export const loadStoredSchedule = (): LabScheduleItem[] => {
  try {
    const data = localStorage.getItem(SCHEDULE_KEY);
    return data ? JSON.parse(data) : INITIAL_SCHEDULE;
  } catch (e) {
    console.error('Error loading schedule:', e);
    return INITIAL_SCHEDULE;
  }
};

export const saveStoredSchedule = (schedule: LabScheduleItem[]) => {
  try {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  } catch (e) {
    console.error('Error saving schedule:', e);
  }
};

export const loadStoredProfile = (): LabProfile => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : DEFAULT_LAB_PROFILE;
  } catch (e) {
    console.error('Error loading profile:', e);
    return DEFAULT_LAB_PROFILE;
  }
};

export const saveStoredProfile = (profile: LabProfile) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
};

export const resetAllDataToDefault = () => {
  localStorage.removeItem(SAMPLES_KEY);
  localStorage.removeItem(PARAMS_KEY);
  localStorage.removeItem(CHEMICALS_KEY);
  localStorage.removeItem(SCHEDULE_KEY);
  localStorage.removeItem(PROFILE_KEY);
};
