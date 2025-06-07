export const formatDate=(date,config)=>{

    const defaultOptions={
        day:'numeric',
        month:'short',
        year:'numeric',
        hour:'numeric',
        minute:'numeric',
        hour12:true
    }
    const options =config? config:defaultOptions;

    return new Date(date).toLocaleDateString('en-US',options);
};