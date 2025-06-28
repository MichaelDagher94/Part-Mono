/* Auto Generated */

import { NOT_Perimeter_Request } from "./nOT_Perimeter_Request";
import { EnuNotificationType } from "./../../../Enumerations/V1/enuNotificationType";

export interface NOT_AllPerimeter_Request extends NOT_Perimeter_Request {
    type?: EnuNotificationType;
    dateTime?: Date;
    numParticipant: string;
}
