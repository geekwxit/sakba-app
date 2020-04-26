/** Define string constants for the app here */
import LocalizedStrings from 'react-native-localization';
import {Text} from "react-native";
import React from "react";
export const strings = new LocalizedStrings({
    en: {
        isRTL: false,
        commonFields: {
            alertTitle: "Alert",
            okButton: "OK",
        },
        login: {
            screenTitle: "Login",
            enterMobile: "Enter your mobile number",
            validation: {
                lengthError: "Please Enter the Mobile No. with minimum length of Eight Number",
                mobileError: "Please Enter the Mobile No.",
                others: "Please Enter Only Numbers"
            },
            noWhatsApp: "Please install whats app to send direct message",
            visitToShopPage: "Visit to Shop",
            reqExecVisit: "Request Executive Visit",
            choiceSelect: "Please Select Your Choice",
            submitButton: "Submit",
            or: "OR",
            installWhatsApp: "Please install whats app to send direct message",
            sendSampleButton: "Send Sample Measurement",
            writeMeasurementButton: "Write Your Measurement",
            buyButton: "Buy Products & Fabrics",
            textUs: 'Text Us',
            callUs: 'Call Us',
        },
        welcomeCustomer: {
            okButton: "OK",
            wText1: "Welcome ",
            wTextMeasure: "Your last measurement on ",
            acceptText: "Do you accept this measurement ?",
            measureAccept: "Do you agree and confirm your sample measurements?",
            agree: "I agree",
            needNew: "I need new measurments",
        },
        customerAgree:{
            dishdashaCount: "How many dishdasha you want ?",
            outside: "YOUR FABRICS",
            inhome: "BUY FROM US",
            proceedButton: "Proceed",
            maxInHome : "Fabrics count value cannot exceed total number of dishdashas!",
            maxOutside: "Fabrics count value cannot exceed total number of dishdashas!",
            buyDishdasha: "Buy Dishdasha", buyDishdashaAndProduct: "Buy Dishdasha and Products"
        },
        deliveryScreen: {
            screenTitle: "Delivery Options",
            text1: "Choose delivery option ",
            fabricLabel: "Your Fabric:",
            sendFabric: "Send it to us",
            pickup: 'We pick up',
            addressLabel: "Address :",
            deliveryLabel: "Your Order :",
            sampleLabel: "Your Sample :",
            pArea: "Area",
            pBlock: 'Block',
            pStreet: "Street",
            pJada: "Jada",
            pHouse: "House",
            pFloor: "Floor",
            pApartment: "Apartment",
            pExtra: "Extra Number",
            opPickup: "Pick up from our store",
            opHomeDel: 'Home delivery',
            opAwqaf: "Awqaf Complex",
            opQurain: "Qurain Shop",
            orderNowButton: "Order Now !",
            detailsRequired: "All Details Are Required",
            pRemarks: "Remarks :",
            email: "Email", name:  "Name", phone: 'Phone'
        },
        fabricScreen: {
            title: "Select Fabric Options",
            text1: "Select each product individually",
            chooseBrand: "Choose fabric Brand: ",
            choosePattern: "Choose fabric Pattern: ",
            chooseColor: "Choose fabric Color: ",
            addToCartButton: "ADD TO CART",
            checkoutButton: "CHECKOUT",

            noFabric: "This fabric has no",

            selectPTitle: "Selected Product", selectPButton: "Add to Cart", selectPBrand: "Fabric Brand: ", selectPPattern: "Fabric Pattern and Color: ", selectPPrice: "Price: ",
            selectPerMeter: 'KD per meter', selectPFinalPrice: "Final Price: ",
            cartEmpty: "Cart is Empty!", cartTitle: "Cart", cartQuantity: "Quantity: ", cartPrice: "Final Price: ", cartRemove: "Remove", cartTotal: "Cart Total", cartConfirm: "Confirm Checkout",
            cartFinalPrice: "Final Price: ",
            previewTitle: {t1: "Pattern Preview", t2: "Color Preview"}, previewOKButton: "OK",
            commonError: "Something went wrong",
            quantityInc: "Product quantity increased!",
            addedToCart: "Product successfully added to your cart",
            moreThan: (inHomeCount)=>('Items on cart are more than '+inHomeCount+' dishdashas. Please remove some items.'),
            lessThan: (inHomeCount)=>('Items on cart are less than '+inHomeCount+' dishdashas. Please add some items.'),
            alreadyInCart: "Product is already in cart.", kd: "KD",
            noColorPattern: "This brand has no pattern or color", measureText: "Your measurement :",
            kdPerMeter: "KD per meter", rateLabel: "Rate :", meters: "meters",

            brandLabel: "brands", patternLabel: "patterns", colorsLabel: "colors",
            fabricsLabel: "Fabrics",productsLabel: "Products",shopTitle: 'Shop',
            noProducts: "No Products found", retryButton: "RETRY",
            promoNumberAlert: "Please enter the promo code first!",
            enterMeasurement: "Please enter measurement!", greaterNumberError: "Number must be greater than 0",
            addToCartLabel: "ADD TO CART", outOfStockLabel: "OUT OF STOCK",
            measurementLabel: "Measurement",
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
            tablePickup: "Pickup", tableDelivery: "Delivery", tableSamplePickup: "Sample Pickup", tableTotal: "Total",tableHeadTitle: "Product / Service",
            tableDiscount: "Discount",
            fabricsText: "FABRICS FROM OUR SHOP",
            promoAlert: "Please enter the promo code first!",
            enterCode: "Enter Code",
            havePromo: "Have a Promo Code?",
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
            alertOnEmailSent: "Our team will contact you for the payment link. Please check your junk/spam email.",
            regularError    : "Something Went Wrong!",
            emailError      : "Invalid email address!",
            reviewError: "Please enter an email and send to continue!"
        },
        visitToShopPage: {
            first: "Aswaq Al Qurain",
            second: "Awqaf Complex",
            awqaf: "Awqaf",
            qurain: "Al Qurain",
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
            total: "Total",
            subtotal: "Subtotal",
            quantity: "Quantity",
            oID: "Order ID",
            orderUnable: "Unable to load any orders",
            retryButton: "RETRY",
            expected: "Expected Delivery Date ",
            pickupCharge: "3 KD",
            deliveryCharge: "3 KD", classic : "Classic Dishdasha",
            error: "Something went wrong. Please retry again later!",
            fabricsText: "FABRICS FROM OUR SHOP",
        },
        sampleMeasurementScreen: {
            title: "Measurement",
            submitButton: "Submit",
            nameLabel: "Name :",
            mobileLabel: "Mobile :",
            metersLabel: "Meters Needed :",
            heading: "Enter your measurement details",
        },
        measurementScreen: {
            submitButton: "Submit Measurement",
            acceptTerms: "Please accept terms and conditions.",
            mandatoryMessage: "All fields are mandatory!",
            measurementSuccess: "Measurement submitted successfully!",
        }
    },
    ar: {
        isRTL: true,
        commonFields: {
            alertTitle: "انذار",
            okButton: "اوكي",
        },
        login: {
            screenTitle: "دخول",
            enterMobile: "عميل عندنا؟ حط رقم تلفونك",
            validation: {
                lengthError: "حط ٨ ارقام اقل شي",
                mobileError: "ادخل رقم تلفووونك",
                others: "حط بس ارقام"
            },
            noWhatsApp: "نزل برنامج الواتساب عشان تكلمنا",
            visitToShopPage: "حياك في فروعنا",
            reqExecVisit: "اطلب خدمة الزيارة",
            choiceSelect: "اختار",
            submitButton: "ادخل",
            or: "او",
            installWhatsApp: "نزل برنامج الواتساب عشان تكلمنا",
            sendSampleButton: "إرسال قياس العينة",
            writeMeasurementButton: "اكتب قياسك",
            buyButton: "شراء المنتجات والأقمشة",
            textUs: 'أرسل لنا رسالة',
            callUs: 'اتصل بنا',
        },
        welcomeCustomer: {
            okButton: "اوكي",
            wText1: "اهلا ",
            wTextMeasure: "آخر قياس لك كان تاريخ ",
            acceptText: "موافق عالقياس؟ ",
            agree: "موافق",
            needNew: "لا، محتاج قياس يديد",
            measureAccept: "هل توافق وتؤكد قياسات العينة الخاصة بك؟",
        },
        customerAgree:{
            dishdashaCount: "جم دشداشة تبي تفصل؟",
            outside: "برسل لكم خامي",
            inhome: "بشتري خام منكم",
            proceedButton: "كمّل",
            maxInHome : "ضفت اكثر من العدد",
            maxOutside: "ضفت اكثر من العدد",
            buyDishdasha: "يشترى دشداشة", buyDishdashaAndProduct: "يشترى  دشداشة و منتجات"
        },
        deliveryScreen: {
            screenTitle: "خيار التسليم", //Googled it
            text1: "اختيار خيار التسليم ", //Googled it
            fabricLabel: "توصيل الخام",
            sendFabric: "اجيبه لكم / او اطرشه لكم المحل",
            pickup: 'طرشولي السايق يستلمه من عندي "ندفعك ٣ د.ك"',
            addressLabel: "العنوان",
            deliveryLabel: "خيارات التوصيل",
            pArea: "المنطقة",
            pBlock: 'قطعة',
            pStreet: "شارع",
            pJada: "جادة",
            pHouse: "منزل",
            pFloor: "الدور",
            pApartment: "شقة",
            pExtra: "رقم تلفون إضافي",
            opPickup: "تستلمها من المحل",
            opHomeDel: 'توصيل',
            opAwqaf: "مجمع الأوقاف",
            opQurain: "أسواق القرين",
            orderNowButton: "انتقل للدفع",
            detailsRequired: "كل البيانات مطلوبة",
            pRemarks: "ملاحظات :",
            email: "ايميلك:", name:  "الاسم", phone: 'رقم',
            sampleLabel: "عينتك:",
        },
        fabricScreen: {
            title: "اختار الخامات",
            text1: "اختار كل قطعه بروح",
            chooseBrand: "اختار نوع الخام",
            choosePattern: "اختار النقشة",
            chooseColor: "اختار اللون",
            addToCartButton: "اضافه القطعة",
            checkoutButton: "انتقل لاختيارات التسليم والاستلام",

            noFabric: "هذا الخام لا يوجد لديه",

            selectPTitle: "الخامة اللي اخترتها", selectPButton: "ضيف القطعة", selectPBrand: "نوع الخام:", selectPPattern: "النقشة واللون:", selectPPrice: "السعر:",
            selectPerMeter: "سعر المتر", selectPFinalPrice: "المجموع:",
            cartEmpty: "ما ضفت شي!!", cartTitle: "الطلب", cartQuantity: "العدد:", cartPrice: "المجموع:", cartRemove: "الغي", cartTotal: "المجموع الكلي", cartConfirm: "تأكيد الطلب",
            cartFinalPrice: "السعر النهائي:",
            previewTitle: {t1: "عرض النقشة", t2: "عرض اللون"}, previewOKButton: "اوكي",
            commonError: "في شي غلط",
            quantityInc: "عدد ال",
            addedToCart: "القطعة انضافت عالطلب",
            moreThan: (inHomeCount)=>("العناصر الموجودة في العربة أكثر من "+ inHomeCount +" الدشداشة. يرجى إزالة بعض العناصر."),
            lessThan: (inHomeCount)=>('العناصر الموجودة في العربة أقل من '+ inHomeCount +' دشداشة. الرجاء إضافة بعض العناصر.'),
            alreadyInCart: "المنتج بالفعل في العربة", kd: "KD",
            noColorPattern: "هذه العلامة التجارية ليس لها نمط أو لون", measureText: "القياس الخاص بك:",
            kdPerMeter: "دينار كويتي لكل متر", rateLabel: "معدل :", meters: "متر",

            brandLabel: "ركة", patternLabel: "أنماط", colorsLabel: "الألوان",
            fabricsLabel: "الخامات", productsLabel: "منتجات",shopTitle: 'أسواق',
            noProducts: "لم يتم العثور على منتجات", retryButton: "عيد حاول",
            promoNumberAlert: "يرجى إدخال الرمز الترويجي أولاً!",
            enterMeasurement: "الرجاء إدخال القياس!", greaterNumberError: "يجب أن يكون الرقم أكبر من 0",
            addToCartLabel: "اضافه القطعة", outOfStockLabel: "إنتهى من المخزن",
            measurementLabel:  "قياس",
        },
        orderDetail:{
            title: "تفاصيل الطلب",
            thankyou: "شكرا على طلبيتك ",
            thankyou2: "اخترت نفصل لك قياسك اللي بتاريخ ",
            thankyou3: "of ",
            orderNum: "رقم طلبك:",
            useremail: "ايميلك:",
            expected: "تاريخ تسليمك الدشاديش",
            paypal: "الدفع بـPaypal فيزا او ماستركارد",
            knet: "اطلب رابط كي-نت",
            error: "مشكلة بالشبكة",
            alertButton: "اوكي",
            alertTitle: "انذار",
            tableDishdasha: "دشداشة كلاسيك *",
            tablePickup: "استلام", tableDelivery: "توصيل", tableSamplePickup: "لاقط عينة", tableTotal: "المجموع",tableHeadTitle: "المنتج/الخدمة",
            tableDiscount: "خصم",
            fabricsText: "خامات من المحل",
            promoAlert: "يرجى إدخال الرمز الترويجي أولاً!",
            enterCode: "ادخل الرمز",
            havePromo: "هل يمتلك الرمز الترويجي؟",
        },
        confirmScreen: {
            screenTitle: "خروج",
            success1: "تم الطلب",
            success2: "بنجاح",
            pEmail: "اكتب ايميلك",
            confirmMsg1: "راح نجهز طلبك",
            confirmMsg2: "بعد ما تكمّل",
            confirmMsg3: "عملية الدفع",
            reviewButton: "عرض الطلب",
            alertOnEmailSent: "راح نكلمك ونرسل لك رابط الدفع يرجى التحقق من البريد الإلكتروني غير الهام / البريد العشوائي الخاص بك",
            regularError    : "في شي غلط",
            emailError      : "الايميل غلط",
            reviewError: "اكتب ايميلك واضغط ارسال"
        },
        visitToShopPage: {
            first: "أسواق القرين",
            second: "مجمع الأوقاف",
            awqaf: "الأوقاف",
            qurain: "القرين",
            button: "افتح الخريطة"
        },
        visitPage: {
            title: "اختار:",
            requestButton: "خدمة الزيارة",
            visitButton: "تزور احد فروعنا"
        },
        requestExecutiveVisit: {
            addressLabel: "العنوان:",
            enterUserName: "اكتب اسمك",
            enterNum: "اكتب رقمك",
            addressField: "الرجاء إدخال حقل عنوان واحد على الأقل",
            sendExec: "راح يكلمك الموظف المختص",
            title: "تفاصيل الطلب",
            pName: "الاسم",
            pNumber: "رقمك",
            pArea: "المنطقة",
            pBlock: 'قطعة',
            pStreet: "شارع",
            pJada: "جادة",
            pHouse: "منزل",
            pFloor: "الدور",
            pApartment: "شقة",
            pExtra: "رقم تلفون إضافي",
            requestButton: "قدم الطلب",
        },
        paypal: {
            screenTitle: "خروج",
        },
        reviewScreen: {
            screenTitle: "عرض الطلب",
            tableHeadTitle: "تفاصيل الطلب",
            delivery: "رسوم التوصيل",
            pickup: "رسوم الاستلام",
            item_name: "الصنف",
            item_price: "السعر",
            total: "المجموع",
            subtotal: "حاصل الجمع",
            quantity: "العدد",
            oID: "رقم الطلب",
            orderUnable: "مو قادر يعرض الطلب",
            retryButton: "عيد حاول",
            expected: "موعد تسليم الطلب ",
            pickupCharge: "٣ د.ك",
            deliveryCharge: "٣ د.ك", classic : "دشداشة كلاسيك",
            error: "في خطأ، جرب مره ثانيه",
            fabricsText: "خامات من المحل",
        },
        sampleMeasurementScreen: {
            title: "قياس",
            submitButton: "إرسال",
            nameLabel:  "الاسم",
            mobileLabel: 'رقم',
            metersLabel: "متر المطلوبة",
            heading: "أدخل تفاصيل القياس الخاصة بك",
        },
        measurementScreen: {
            submitButton: "إرسال القياس",
            acceptTerms: "يرجى قبول الشروط والأحكام",
            mandatoryMessage: "جميع الحقول إلزامية!",
            measurementSuccess: "تم إرسال القياس بنجاح!",

        }
    },
})


/**
 * A helpful function to get all keys of an object excluding arrays
   function getKeys(object){
      for(key in object){
         typeof (eval('object.'+key))== 'object'?getKeys(eval('object.'+key)):ar.push(key);
      }
   }
 */

