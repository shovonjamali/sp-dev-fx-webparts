export interface IUtilityService {
    sendNotification(results: any[]): Promise<any[]>;
}