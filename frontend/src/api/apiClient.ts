async function apiRequest ( path : string , method : string , body ?: object )
{
    const token = localStorage.getItem("token");
    const baseUrl = "http://localhost:3000/api";
    const url = baseUrl + path;

    const headers : Record <string , string> = {
        "Content-Type" : "application/json"
    };

    if(token)
    {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url , {method , headers , body : body ? JSON.stringify(body) : undefined});
    const data = await response.json();
    
    if(response.ok)
    {
        return( data.message || "Something Wenr Wrong")
    }
    
    return data;
}

export default apiRequest;