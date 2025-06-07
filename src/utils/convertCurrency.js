import axios from "axios";

export const convertCurrency = async (amount, currencyFrom, currencyTo) => {
    try {
        if (isNaN(amount) || amount <= 0) {
            throw new Error("الرجاء إدخال قيمة صحيحة أكبر من 0");
        }

        // تحويل أسماء العملات إلى حروف صغيرة لاستخدامها في API
        currencyFrom = currencyFrom.toLowerCase();
        currencyTo = currencyTo.toLowerCase();

        // جلب بيانات العملات من API
        const apiUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currencyFrom}.json`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data[currencyFrom]) {
            throw new Error("فشل جلب بيانات الصرف.");
        }

        const rates = response.data[currencyFrom];

        if (!rates[currencyTo]) {
            throw new Error(`لم يتم العثور على سعر صرف لـ ${currencyFrom} إلى ${currencyTo}.`);
        }

        // حساب التحويل
        
        const convertedAmount = amount * rates[currencyTo];

        return convertedAmount.toFixed(2 );
    } catch (error) {
        return 0;
    }
};