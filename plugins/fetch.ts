export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    nuxtApp.$fetch = $fetch.create({
        baseURL: runtimeConfig.public.baseUrl as string,
        onRequest: (req) => {
            console.log(req);
        },
        onRequestError: (err) => {
            console.log(err);
        }
    })
})