export default defineNuxtPlugin((nuxtAApp) => {
    const runtimeConfig = useRuntimeConfig();
    nuxtAApp.$fetch = $fetch.create({
        baseURL: runtimeConfig.public.baseUrl as string,
        onRequest: (req) => {
            console.log(req);
        }
    })
})