export interface StageI {
    _id: string;
    name: string;
    priority: number;
    startingDate: Date;
    endingDate: Date;
    buildDeliveryDate: Date | undefined;
    pitchPreviewDeliveryDate: Date | undefined;
    pitchDeliveryDate: Date | undefined;
    pitchTestDate: Date | undefined;
    judgeDeliveryDate: Date | undefined;
    demoDayDate: Date | undefined;
}

export interface StageListI {
    stages: StageI[];
}