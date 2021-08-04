import { ServiceScope, ServiceKey } from '@microsoft/sp-core-library';
import { PageContext } from '@microsoft/sp-page-context';

import { IEmailProperties, IWebInfo, sp } from "@pnp/sp/presets/all";
import { ISiteUserInfo } from '@pnp/sp/site-users/types';

import { IUtilityService } from './IUtilityService';

export class UtilityService implements IUtilityService {

    public static readonly serviceKey: ServiceKey<IUtilityService> = ServiceKey.create<IUtilityService>('rsgu:IUtilityService', UtilityService);

    private _pageContext: PageContext;

    constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {          
            this._pageContext = serviceScope.consume(PageContext.serviceKey);
            sp.setup({
                sp: {
                    baseUrl: this._pageContext.web.absoluteUrl
                }
            });
        });        
    }

    public async sendNotification(results: any[]): Promise<any[]> {
        //console.log(`Sending notifications`);
        let promises: any[] = [];

        results.forEach((member: ISiteUserInfo) => {
            promises.push(this._sendEmail(member.Email));
        });

        const emailResults = await Promise.all(promises);
        return emailResults;
    }

    private async _sendEmail(emailAddress: string): Promise<boolean> {
        try {
            let web: IWebInfo = await sp.web.get();

            let subject: string = `You are invited to collaborate on ${web.Title}`;
            let body: string = `<p style="font-size: 18px">Here's the site that is shared with you.</p>
                                <p style="font-size: 28px">Go to <a href="${web.Url}" target="_blank" style="color: #0072BC">${web.Title}</a></p>
                                <p style="font-size: 14px"><a href="${web.Url}" target="_blank" style="color: #0072BC">Follow</a> this site to get updates in your newsfeed.</p>`;

            const emailProps: IEmailProperties = {
                To: [emailAddress],
                // CC: ["user2@site.com", "user3@site.com"],
                // BCC: ["user4@site.com", "user5@site.com"],
                Subject: subject,
                Body: body,
                AdditionalHeaders: {
                    "content-type": "text/html"
                }
            };

            await sp.utility.sendEmail(emailProps);
            //console.log(`Email sent for: ${emailAddress}`);

            return true;
        }
        catch(err) {
            console.log(`Email sending failed for: ${emailAddress}. Error: ${err}`);
            return false;
        }
    }
}