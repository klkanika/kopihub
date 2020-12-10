import axios from "axios"

export const uploadImg = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    const fmData = new FormData();
    const config = {
        headers: { "content-type": "multipart/form-data" }
    };
    fmData.append("myFile", file);
    try {
        const res = await axios.post(
            "https://kopihub-frontend-ura2vr67wa-as.a.run.app/uploadfile",
            // "https://a3bd0e2b3833.ap.ngrok.io/uploadfile",
            fmData,
            config
        );
        onSuccess(res, file);
        console.log("server res: ", res);
    } catch (err) {
        console.log("Eroor: ", err);
        const error = new Error("Some error");
        onError(err);
    }
};