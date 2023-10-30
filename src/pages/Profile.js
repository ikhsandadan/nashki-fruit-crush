import { useState, useEffect } from "react";

const Profile = ({ address, email, walletBalance, points }) => {
    const [data, setData] = useState();
    const chain_name = "imtbl-zkevm-testnet";

    const readData = async () => {
        try {
            await fetch(`https://api.sandbox.immutable.com/v1/chains/${chain_name}/accounts/${address}/nfts`)
            .then((response) => response.json())
            .then((data) => {
            setData(data.result);
            });
        } catch (e) {
        console.log(e);
        }
    };

    useEffect(() => {
        readData();
    },[]);
    return (
        <div className="flex flex-col mx-10 gap-5 px-5 py-5 place-content-center text-center">
            <div className="font-sans text-6xl font-bold text-yellow-700">My Profile</div>
            <div className="flex flex-col place-self-center my-5 w-auto h-auto rounded-xl backdrop-blur-sm bg-white/40 p-2">
                <div className="grid grid-cols-2">
                    <div className="font-sans text-start text-xl font-bold text-yellow-700">Wallet Address:</div>
                    <div className="font-sans text-xl font-bold text-yellow-700">{address}</div>
                    <div className="font-sans text-start text-xl font-bold text-yellow-700">Email:</div>
                    <div className="font-sans text-xl font-bold text-yellow-700">{email}</div>
                    <div className="font-sans text-start text-xl font-bold text-yellow-700">Wallet Balance:</div>
                    <div className="font-sans text-xl font-bold text-yellow-700">{walletBalance} IMX</div>
                    <div className="font-sans text-start text-xl font-bold text-yellow-700">Points:</div>
                    <div className="font-sans text-xl font-bold text-yellow-700">{points}</div>
                </div>
            </div>
            <hr/>
            <div className="font-sans text-xl font-bold text-yellow-700">My NFTs Collections:</div>
            <div className="flex flex-row justify-center gap-5">
                {data?.map((index, id) => (
                    <div key={id} className="flex flex-col place-self-center my-5 w-auto h-auto rounded-xl backdrop-blur-sm bg-white/40 p-2 hover:drop-shadow-lg hover:scale-105">
                        <img src={index.image} alt="NFT" className="place-self-center rounded-xl w-auto h-auto max-w-xs object-cover"/>
                        <div className="text-center font-sans text-xl">{index.name}: {index.token_id}</div>
                        <div className="flex text-center justify-center">
                            <p id={index.token_id} className="text-center font-sans text-xs w-60 h-auto">{index.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <hr/>
        </div>
    )
}

export default Profile