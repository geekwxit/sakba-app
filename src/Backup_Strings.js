/** Define string constants for the app here */
import LocalizedStrings from 'react-native-localization';
import {Text} from "react-native";
//Login screen
export const loginStrings = {
    allNumberLink   : "https://sakba.net/mobileApi/all-number.php",
    en:{
        validation: {
            lengthError : 'Pls Enter the Mobile No. with minimum length of Eight Number',
            mobileError : 'Pls Enter the Mobile No.',
            others      : 'Please Enter Only Numbers'
        },
        noWhatsApp      : 'Please install whats app to send direct message',
    },
    ar: {

    }
}

//Order Confirm screen
export const oConfirm = {
    screenTitle     : "Checkout",
    sendEmailLink   : "https://sakba.net/mobileApi/request_paymentemail.php",
    reviewError     : "Please enter an email and send to continue!"
}

/**Fabric Screen**/

export const fabricStrings = {
    getAllFabrics: 'https://sakba.net/mobileApi/get_fabrics.php',
}

/**Delivery Screen*/
export const deliveryStrings = {
    order_now  : 'https://sakba.net/mobileApi/order_test.php',
}

export const visitToShopPage = {
    awqaf_location_url: 'https://goo.gl/maps/M4YDSRUrgARVrmoQ9',
    view_on_map       : 'https://goo.gl/maps/QG8Ma8ciQfQJxNnZ9',
}

export const strings = new LocalizedStrings({
    en: {
        isRTL: false,
        login: {
            screenTitle: "Login",
            enterMobile: "Enter your mobile number",
            validation: {
                lengthError: "Pls Enter the Mobile No. with minimum length of Eight Number",
                mobileError: "Pls Enter the Mobile No.",
                others: "Please Enter Only Numbers"
            },
            noWhatsApp: "Please install whats app to send direct message",
            visitToShopPage: "Visit to Shop",
            reqExecVisit: "Request Executive Visit",
            choiceSelect: "Please Select Your Choice",
            submitButton: "Submit",
            or: "OR",
            installWhatsApp: "Please install whats app to send direct message",
        },
        welcomeCustomer: {
            wText1: "Welcome",
            wTextMeasure: "Your last measurement on ",
            acceptText: "Do you accept this measurement",
            agree: "I agree",
            needNew: "I need new mesurments",
        },
        customerAgree:{
            dishdashaCount: "How many dishdasha you want ?",
            outside: "TAKE YOUR OWN",
            inhome: "BUY FROM US",
            proceedButton: "Proceed",
            maxInHome : "In home count value cannot exceed total no of dishdashas!",
            maxOutside: "Outside count value cannot exceed total no of dishdashas!",

        },
        deliveryScreen: {
            screenTitle: "Delivery Options",
            text1: "Choose delivery option ",
            fabricLabel: "Fabrics",
            sendFabric: "Send your fabric to us",
            pickup: 'Pick up Pay "3kd"',
            addressLabel: "Address :",
            deliveryLabel: "Choose delivery option ",
            pArea: "Area",
            pBlock: 'Block',
            pStreet: "Street",
            pJada: "Jada",
            pHouse: "House",
            pFloor: "Floor",
            pApartment: "Apartment",
            pExtra: "Extra Number",
            opPickup: "Pick up from our store",
            opHomeDel: 'Home delivery pay "3 kd""',
            opAwqaf: "Awqaf Complex",
            opQurain: "Qurain Shop",
            orderNowButton: "Order Now !",
            detailsRequired: "All Details Are Required",
        },
        fabricScreen: {
            title: "Select Fabric Options",
            text1: "Select each product individually",
            chooseBrand: "Choose fabric Brand: ",
            choosePattern: "Choose fabric Pattern: ",
            chooseColor: "Choose fabric Color: ",
            addToCartButton: "ADD TO CART",
            checkoutButton: "CHECKOUT",

            selectPTitle: "Selected Product", selectPButton: "Add to Cart", selectPBrand: "Fabric Brand: ", selectPPattern: "Fabric Pattern and Color: ", selectPPrice: "Price: ",
            selectPerMeter: 'KD per meter', selectPFinalPrice: "Final Price: ",
            cartEmpty: "Cart is Empty!", cartTitle: "Cart", cartQuantity: "Quantity: ", cartPrice: "Final Price: ", cartRemove: "Remove", cartTotal: "Cart Total", cartConfirm: "Confirm Checkout",
            cartFinalPrice: "Final Price: ",
            previewTitle: {t1: "Pattern Preview", t2: "Color Preview"}, previewOKButton: "OK",
            commonError: "Something went wrong",
            quantityInc: "Product quantity increased!",
            addedToCart: "Product successfully added to your cart",
            moreThan: (inHomeCount)=>('Items on cart are more than selected in-home dishdashas i.e.' + inHomeCount +' . Please remove some items.'),
            lessThan: (inHomeCount)=>('Items on cart are less than selected in-home dishdashas i.e.' + inHomeCount +' . Please add some items.'),
        },
        orderDetail:{
            title: "Order Details",
            thankyou: "Thank you for your order ",
            thankyou2: "you confirmed the measurement ",
            thankyou3: "of ",
            orderNum: "Your order number :",
            useremail: "Your E-mail ID :",
            expected: "Expected Delivery on",
            paypal: "Paypal (Visa/Mastercard)",
            knet: "Request K-Net Link",
            error: "Something wrong in your network.",
            alertButton: "Ok",
            alertTitle: "Alert",
            tableDishdasha: "Classic Dishdasha *",
            tablePickup: "Pickup", tableDelivery: "Delivery", tableTotal: "Total",tableHeadTitle: "Product / Service",
            fabricsText: "FABRICS FROM OUR SHOP",
        },
        confirmScreen: {
            screenTitle: "Checkout",
            success1: "Order",
            success2: "Successful",
            pEmail: "Enter your email here...",
            confirmMsg1: "Your Order will be confirmed",
            confirmMsg2: "when you complete",
            confirmMsg3: "your payment",
            reviewButton: "REVIEW ORDER",
            alertOnEmailSent: "Our team will contact you for the payment link.",
            regularError    : "Something Went Wrong!",
            emailError      : "Invalid email address!",
            reviewError: "Please enter an email and send to continue!"
        },
        visitToShopPage: {
            first: "Aswaq Al Qurain",
            second: "Awqaf Complex",
            button: "View On Map"
        },
        visitPage: {
            title: "Please Select Your Choice",
            requestButton: "Request Executive Visit ",
            visitButton: "Visit to Shop"
        },
        requestExecutiveVisit: {
            addressLabel: "Address :",
            enterUserName: "Please Enter The User Name",
            enterNum: "Please Enter the Number",
            addressField: "Please enter atleast one address field",
            sendExec: "We Will Send Executive soon",
            title: "Details for Executive Visit",
            pName: "Name",
            pNumber: "Number",
            pArea: "Area",
            pBlock: 'Block',
            pStreet: "Street",
            pJada: "Jada",
            pHouse: "House",
            pFloor: "Floor",
            pApartment: "Apartment",
            pExtra: "Extra Number",
            requestButton: "Request",
        },
        paypal: {
            screenTitle: "Checkout",
        },
        reviewScreen: {
            screenTitle: "Order Review",
            tableHeadTitle: 'Order Details',
            delivery: "Delivery Charges",
            pickup: "Pick Up Charges",
            item_name: "Item Name",
            item_price: "Item Price",
            subtotal: "Subtotal",
            total: "Total",
            quantity: "Quantity",
            oID: "Order ID",
            orderUnable: "Unable to load any orders",
            retryButton: "RETRY",
            expected: "Expected Delivery Date ",
            pickupCharge: "3 KD",
            deliveryCharge: "3 KD", classic : "Classic Dishdasha",
            error: "Something went wrong. Please retry again later!",
        }
    },
    ar: {
        isRTL: true,
        login: {
            screenTitle: "Login",
            enterMobile: "اپنا موبائل نمبر درج کریں",
            validation: {
                lengthError: "براہ کرم آٹھ ہندسوں کی کم سے کم لمبائی والا موبائل نمبر درج کریں",
                mobileError: "برائے کرم موبائل نمبر درج کریں",
                others: "براہ کرم صرف نمبر درج کریں"
            },
            noWhatsApp: "براہ کرم براہ راست پیغام بھیجنے کے لئے واٹس ایپ انسٹال کریں",
            visitToShopPage: "دکان پر جائیں",
            reqExecVisit: "ایگزیکٹو وزٹ کی درخواست کریں",
            choiceSelect: "برائے کرم اپنی پسند کا انتخاب کریں",
            submitButton: "جمع کرائیں",
            or: "یا",
            installWhatsApp: "براہ کرم براہ راست پیغام بھیجنے کے لئے واٹس ایپ انسٹال کریں",
        },
        welcomeCustomer: {
            wText1: "خوش آمدید ",
            wTextMeasure: " میں آپ کی آخری پیمائش ",
            acceptText: " کیا آپ اس پیمائش کو قبول کرتے ہیں؟",
            agree: "میں راضی ہوں",
            needNew: "مجھے نئی پیمائش کی ضرورت ہےs",
        },
        customerAgree:{
            dishdashaCount: "آپ کتنے ڈشڈیشا چاہتے ہیں؟",
            outside: "خود اپنا لو",
            inhome: "امریکہ سے خریدیں",
            proceedButton: "آگے بڑھو",
            maxInHome : "گھر میں گنتی کی قیمت ڈشڈیشاوں کی کل تعداد سے زیادہ نہیں ہوسکتی ہے!",
            maxOutside: "باہر کی گنتی کی قیمت ڈشڈیشاوں کی کل تعداد سے زیادہ نہیں ہوسکتی ہے!",

        },
        deliveryScreen: {
            screenTitle: "فراہمی کے اختیارات",
            deliveryLabel: "ترسیل کا اختیار منتخب کریں",
            fabricLabel: "کپڑے",
            sendFabric: "ہمیں اپنے تانے بانے بھیجیں",
            pickup: 'تنخواہ 3 کلو اٹھاؤ',
            text1: "ترسیل کا اختیار منتخب کریں",
            addressLabel: "پتہ:",
            pArea: "رقبہ",
            pBlock: 'بلاک کریں',
            pStreet: "گلی",
            pJada: "جاڈا",
            pHouse: "گھر",
            pFloor: "فرش",
            pApartment: "اپارٹمنٹ",
            pExtra: "اضافی نمبر",
            opPickup: "ہمارے اسٹور سے اٹھاو",
            opHomeDel: 'گھر کی ترسیل کی ادائیگی 3 KD',
            opAwqaf: "اوقاف کمپلیکس",
            opQurain: "قورین شاپ",
            orderNowButton: "اب حکم !",
            detailsRequired: "تمام تفصیلات درکار ہیں",
        },
        fabricScreen: {
            title: "تانے بانے کے اختیارات منتخب کریں",
            text1: "ہر پروڈکٹ کو انفرادی طور پر منتخب کریں",
            chooseBrand: "کپڑے کا انتخاب کریں برانڈ:",
            choosePattern: "تانے بانے کا نمونہ منتخب کریں:",
            chooseColor: "کپڑے کا رنگ منتخب کریں:",
            addToCartButton: "ٹوکری میں شامل کریں",
            checkoutButton: "اس کو دیکھو",

            selectPTitle: "منتخب کردہ مصنوعات", selectPButton: "ٹوکری میں شامل کریں", selectPBrand: "فیبرک برانڈ:", selectPPattern: "فیبرک پیٹرن اور رنگین:", selectPPrice: "قیمت:",
            selectPerMeter: 'KD فی میٹر', selectPFinalPrice: "حتمی قیمت: ",
            cartEmpty: "ٹوکری خالی ہے!", cartTitle: "ٹوکری", cartQuantity: "مقدار:", cartPrice: "حتمی قیمت:", cartRemove: "دور", cartTotal: "ٹوکری کل", cartConfirm: "چیک آؤٹ کی تصدیق کریں",
            cartFinalPrice: "حتمی قیمت: ",
            previewTitle: {t1: "پیٹرن کا پیش نظارہ", t2: "رنگین پیش نظارہ"}, previewOKButton: "ٹھیک ہے",
            commonError: "کچھ غلط ہو گیا",
            quantityInc: "مصنوعات کی مقدار میں اضافہ!",
            addedToCart: "پروڈکٹ کامیابی کے ساتھ آپ کی ٹوکری میں شامل ہوگیا",
            moreThan: (inHomeCount)=>('براہ کرم کچھ آئٹمز کو ہٹا دیں۔'+ inHomeCount +'کارٹ میں آئٹمز گھر میں ڈش ڈشاس منتخب کردہ سے زیادہ ہیں۔'),
            lessThan: (inHomeCount)=>("گھر میں ڈش ڈشاس یعنی کارٹ میں آئٹمز منتخب کردہ سے کم ہیں۔" + inHomeCount + "براہ کرم کچھ آئٹمز شامل کریں۔"),
        },
        orderDetail:{
            title: "آرڈر کی تفصیلات",
            thankyou: "Thank you for your order ",        //NOT USEFUL
            thankyou2: "you confirmed the measurement ",//NOT USEFUL
            thankyou3: "of ",//NOT USEFUL
            orderNum: "Your order number :",//NOT USEFUL
            useremail: "Your E-mail ID :",//NOT USEFUL
            expected: "متوقع ترسیل جاری ہے",
            paypal: "پے پال (ویزا / ماسٹر کارڈ)",
            knet: "K- نیٹ لنک کی درخواست کریں",
            error: "آپ کے نیٹ ورک میں کچھ غلط ہے۔",
            alertButton: "ٹھیک ہے",
            alertTitle: "انتباہ",
            tableDishdasha: "کلاسیکی ڈشداشا *",
            tablePickup: "اٹھا لینا", tableDelivery: "ترسیل", tableTotal: "کل",tableHeadTitle: "پروڈکٹ / سروس",
            fabricsText: "ہماری دکان سے کپڑے",
        },
        confirmScreen: {
            screenTitle: "اس کو دیکھو",
            success1: "ترتیب",
            success2: "کامیاب",
            pEmail: "اپنا ای میل یہاں درج کریں ...",
            confirmMsg1: "آپ کے آرڈر کی تصدیق ہوجائے گی",
            confirmMsg2: "جب آپ مکمل کریں",
            confirmMsg3: "آپ کی ادائیگی",
            reviewButton: "آرڈر کا جائزہ لیں",
            alertOnEmailSent: "ہماری ٹیم ادائیگی کے لنک کیلئے آپ سے رابطہ کرے گی۔",
            regularError    : "کچھ غلط ہو گیا!",
            emailError      : "غلط ای میل ایڈریس!",
            reviewError: "براہ کرم ایک ای میل درج کریں اور جاری رکھنے کے لئے بھیجیں!"
        },
        visitToShopPage: {
            first: "اسوق القرآن",
            second: "اوقاف کمپلیکس",
            button: "نقشہ پر دیکھیں"
        },
        visitPage: {
            title: "برائے کرم اپنی پسند کا انتخاب کریں",
            requestButton: "ایگزیکٹو وزٹ کی درخواست کریں ",
            visitButton: "دکان پر جائیں"
        },
        requestExecutiveVisit: {
            addressLabel: "پتہ:",
            enterUserName: "برائے کرم صارف کا نام درج کریں",
            enterNum: "براہ کرم نمبر درج کریں",
            addressField: "براہ کرم کم از کم ایک ایڈریس فیلڈ درج کریں",
            sendExec: "ہم جلد ہی ایگزیکٹو بھیجیں گے",
            title: "ایگزیکٹو وزٹ کے لئے تفصیلات",
            pName: "نام",
            pNumber: "نمبر",
            pArea: "رقبہ",
            pBlock: 'بلاک کریں',
            pStreet: "گلی",
            pJada: "جاڈا",
            pHouse: "گھر",
            pFloor: "فرش",
            pApartment: "اپارٹمنٹ",
            pExtra: "اضافی نمبر",
            requestButton: "درخواست کریں",
        },
        paypal: {
            screenTitle: "اس کو دیکھو",
        },
        reviewScreen: {
            screenTitle: "آرڈر جائزہ",
            tableHeadTitle: 'آرڈر کی تفصیلات',
            delivery: "ڈلیوری چارجز",
            pickup: "چارجز اٹھاو",
            item_name: "شے کا نام",
            item_price: "آئٹم کی قیمت",
            total: "کل",
            quantity: "مقدار",
            oID: "آرڈر کی شناخت",
            orderUnable: "کوئی آرڈر لوڈ کرنے سے قاصر ہے",
            retryButton: "دوبارہ کوشش کریں",
            expected: "ترسیل کی متوقع تاریخ",
            pickupCharge: "3 KD",
            deliveryCharge: "3 KD", classic : "کلاسیکی ڈشداشا",
            error: "کچھ غلط ہو گیا. براہ کرم بعد میں دوبارہ کوشش کریں!",
        }
    },
})



//https://sakba.net/mobileApi/order.php'
// ar: {
//     isRTL: false,
//         login: {
//         enterMobile: "Enter youasdfasdfar mobile number",
//             validation: {
//             lengthError: "Pls Enterfasdfasdf the Mobile No. with minimum length of Eight Number",
//                 mobileError: "Pls Enter the Mobile No.",
//                 others: "Please Enter Only Numbers"
//         },
//         noWhatsApp: "Please install whats app to send direct message",
//             visitToShopPage: "Visit to Shop",
//             reqExecVisit: "Request Executive Visit",
//             choiceSelect: "Please Select Your Choice",
//             submitButton: "Submit",
//             or: "OR",
//             installWhatsApp: "Please install whats app to send direct message",
//     },
//     oConfirm: {
//         alertOnEmailSent: "Our team will contact you for the payment link.",
//             regularError: "Something Went Wrong!",
//             emailError: "Invalid email address!",
//             screenTitle: "Checkout",
//             reviewError: "Please enter an email and send to continue!"
//     },
//     fabricStrings: {
//         getAllFabrics: "https://sakba.net/mobileApi/get_fabrics.php"
//     },
//     deliveryStrings: {
//         order_now: "https://sakba.net/mobileApi/order_test.php"
//     },
//     visitToShopPage: {
//         first: "arabbrabr",
//             second: "Aararawqaf Complex",
//             button: "arararView On Map"
//     }
// },
