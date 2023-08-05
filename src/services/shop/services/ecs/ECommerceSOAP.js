

module.exports = async (req, res, next) => {
    const action = req.action;
    const body = req.body;
    console.log(body)

    let actionResponse;

    switch (action) {
        case "GetECConfig":
            actionResponse = {
                ServiceStandbyMode: false,
                ContentPrefixURL: global.config.CCS_URL,
                UncachedContentPrefixURL: global.config.CCS_URL,
                SystemContentPrefixURL: "http://nus.cdn.shop.wii.com/ccs/download",
                SystemUncachedContentPrefixURL: global.config.CCS_URL,
                EcsURL: global.config.ECS_URL,
                IasURL: global.config.IAS_URL,
                CasURL: global.config.CAS_URL,
                NusURL: global.config.NUS_URL
            };
            break;
        case "CheckDeviceStatus":
            actionResponse = {
                ServiceStandbyMode: false,
                Balance: {
                    Amount: '999',
                    Currency: 'POINTS'
                },
                ForceSyncTime: 0,
                ExtTicketTime: Date.now(),
                SyncTime: Date.now()
            };
            break;
        case "PurchaseTitle":
            const timestampNano = (Date.now() / 1000).toFixed(0);
            const timestamp = timestampNano + "000";
            actionResponse = {
                ServiceStandbyMode: false,
                ItemId: 0,
                Balance: {
                  Amount: 0,
                  Currency: "POINTS"
                },
                Transactions: {
                    TransactionId: "00000000",
                    Date: Date.now(),
                    Type: "PURCHGAME"
                },
                SyncTime: Date.now(),
                ETickets: "00000000",
                Certs: [body.DeviceCert, body.DeviceCert],
                TitleId: body.TitleId
            };
        default:
            global.logger.warn("[ECS - ECommerceSOAP] Unknown SOAP action " + action);
            break;
    }

    if (actionResponse) return res.soap(actionResponse);
    else return res.status(404).send();
};