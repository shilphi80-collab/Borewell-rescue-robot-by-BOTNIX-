export type SubsystemStatus = 'Operational' | 'Calibrated' | 'Standby' | 'Maintenance';

export type ReadinessStatus = 
  | 'Competition Ready - Malaysia Finals'
  | 'Field Tested & Operational'
  | 'System Calibration Phase'
  | 'Prototype Active';

export interface SubsystemHealth {
  id: string;
  name: string;
  category: 'mechanical' | 'optical' | 'electrical' | 'pneumatic' | 'telecom';
  status: SubsystemStatus;
  healthPercentage: number;
  detail: string;
}

export interface PictureSlot {
  id: string;
  title: string;
  shortDescription: string;
  category: 'logo' | 'robot-unit' | 'ground-unit' | 'claw' | 'base-support' | 'electronics' | 'battery' | 'communication' | 'custom';
  url?: string;
  caption?: string;
  dateUpdated?: string;
}

export interface ProjectPhoto {
  id: string;
  url: string; // Data URL or asset path
  title: string;
  caption: string;
  category: 'logo' | 'robot-unit' | 'ground-unit' | 'claw' | 'base-support' | 'electronics' | 'battery' | 'communication' | 'chassis' | 'testing' | 'exhibition';
  dateAdded: string;
  isPrimary?: boolean;
}

export interface FabricationStage {
  id: string;
  order: number;
  title: string;
  phase: string;
  summary: string;
  materials: string[];
  tools: string[];
  engineeringProcess: string;
  challengesAndSolutions: string;
  imageUrl?: string;
}

export interface RobotFunction {
  id: string;
  order: number;
  title: string;
  subsystem: string;
  iconName: string; // Lucide icon identifier
  shortDescription: string;
  howItWorks: string;
  technicalSpecs: { label: string; value: string }[];
  safetyFailSafe: string;
  imageUrl?: string;
  stepInRescueSequence?: number; // 1: Descent, 2: Scanning, etc.
}

export interface BillOfMaterialItem {
  id: string;
  item: string;
  specification: string;
  quantity: number;
  costEstimateUSD?: number;
  purpose: string;
}

export interface WrittenReport {
  abstract: string;
  problemStatement: string;
  designMethodology: string;
  mechanicalDesign: string;
  electricalAndSensory: string;
  workingPrinciple: string;
  safetyAndFailSafes: string;
  fieldTestResults: string;
  conclusionAndMalaysiaGoals: string;
  billOfMaterials: BillOfMaterialItem[];
}

export interface MotorTelemetry {
  motorId: number;
  name: string;
  function: string;
  status: 'Forward' | 'Backward' | 'Stopped';
  relays: [number, number]; // e.g. Relay 1 & 2 for Motor 1
  voltage: string;
}

export interface ProjectData {
  name: string;
  projectCode: string;
  motto: string;
  subtitle: string;
  team: {
    name: string;
    members: string[];
    institution: string;
    competitionEvent: string;
    competitionRound: string;
    countryTarget: string;
    originCountry: string;
    year: string;
  };
  overallCondition: {
    readinessStatus: ReadinessStatus;
    depthRatingMeters: number;
    boreholeDiameterRange: string;
    payloadCapacityKg: number;
    totalWeightKg: number;
    batterySpec: string;
    batteryBackupMinutes: number;
    microcontroller: string;
    firmwareLanguage: string;
    motorCount: number;
    relayModule: string;
    communicationProtocol: string;
    tetherCableType: string;
    liftingMechanism: string;
    voiceCommunication: string;
    oxygenDelivery: string;
    cameraSpecs: string;
    subsystems: SubsystemHealth[];
  };
  units: {
    robotUnit: {
      title: string;
      description: string;
      mainClaw: string;
      foldableSupport: string;
      cameraSystem: string;
      voiceMethod: string;
      oxygenLine: string;
      liftingMethod: string;
      motorAssignment: string;
      communicationNode: string;
    };
    groundUnit: {
      title: string;
      description: string;
      controlPanel: string;
      displaySystem: string;
      relayBox: string;
      powerSource: string;
      operatorRole: string;
      communicationMaster: string;
    };
  };
  slots: PictureSlot[];
  photos: ProjectPhoto[];
  fabricationStages: FabricationStage[];
  robotFunctions: RobotFunction[];
  writtenReport: WrittenReport;
  lastUpdated: string;
}
