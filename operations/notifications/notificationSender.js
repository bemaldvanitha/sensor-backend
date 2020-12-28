const emailNotification = require('./emailNotification')
const smsNotification = require('./smsNotification')

const notificationSender = ({notifier}) => {
    if(notifier.email){
        emailNotification();
    }

    else if (notifier.phoneNumber) {
        smsNotification();
        voiceNotification()
    }
}

