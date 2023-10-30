import { useEffect, useState } from "react";

function RedeemButton({ nft, redeemNFT, flag, setFlag }) {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <button
            className="primary-btn ml-14 mr-14 mt-14 w-32 content-center items-center font-semibold m-0 hover:scale-110"
            onClick={async () => {
            setIsLoading(true);
            var NFTPoints = document.getElementById(nft.token_id).innerHTML.replace(/\D/g, '');

            await redeemNFT(nft.token_id, NFTPoints);

            setIsLoading(false);
            setFlag(!flag);
            }}
            disabled={isLoading}
        >
            {isLoading ? "Claiming..." : "Claim NFT"}
        </button>
    );
}

const Redeem = ({redeemNFT, scAddress }) => {
    const [flag, setFlag] = useState(false);
    const [data, setData] = useState([]);
    const chain_name = "imtbl-zkevm-testnet";
    const dataNFT = [
        {
            id: 1,
            name: "Medal NFT",
            image: "https://amethyst-implicit-silkworm-944.mypinata.cloud/ipfs/QmdvyzDqckcQKSJGKjTuJMBjNFmoiHzvbU1J11mM22JdRT",
            token_id: 1,
            description: "This is an NFT awarded to players who achieve a Points more than 1000 points"
        },
        {
            id: 2,
            name: "Medal NFT",
            image: "https://amethyst-implicit-silkworm-944.mypinata.cloud/ipfs/QmdNg8TXfVcgPN3Bv81tsXpijrPwtKVnYNGw7bP4DVqqPV",
            token_id: 2,
            description: "This is an NFT awarded to players who achieve a Points more than 500 points"
        },
        {
            id: 3,
            name: "Medal NFT",
            image: "https://amethyst-implicit-silkworm-944.mypinata.cloud/ipfs/QmbQh9ZTeWbiwkbagBDDhDWBb3DcFcwcF6SGPiV1gAbRap",
            token_id: 3,
            description: "This is an NFT awarded to players who achieve a Points more than 250 points"
        },
    ];

    const readData = async () => {
        const fetchDataPromises = [];
        try {
            for (let i = 0; i < dataNFT.length; i++) {
                await fetch(`https://api.sandbox.immutable.com/v1/chains/${chain_name}/collections/${scAddress}/nfts/${i+1}/owners`)
                .then((response) => response.json())
                .then((list) => {
                    fetchDataPromises.push(list.result);
                });

                const allData = await Promise.all(fetchDataPromises);

                setData(allData);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        readData();
    },[flag]);

    return (
        <div className="flex flex-row place-content-center mx-10 gap-5 px-5 py-5 auto-rows-auto text-center">
            {dataNFT.map((nft, id) => (
                <div key={id} className="flex flex-col w-22 rounded-xl backdrop-blur-sm bg-white/40 p-2 hover:drop-shadow-lg hover:scale-105">
                    <img src={nft.image} alt="NFT" className="place-self-center rounded-xl object-cover w-auto h-auto max-w-xs" />
                    <div className="text-center my-2 font-sans text-xl">
                        {nft.name}: {nft.token_id}
                    </div>
                    <div className="flex text-center justify-center">
                        <p id={nft.token_id} className="text-center font-sans w-60 h-auto">{nft.description}</p>
                    </div>
                    <div className="flex text-center justify-center m-0">
                        {data[id] && data[id]?.some(item => parseInt(item.token_id) === nft.token_id) ? (
                                <div className="flex flex-col text-center justify-center mt-2">
                                    <p className="text-center font-sans">Already Claimed By:</p>
                                    <p className="text-center font-sans text-lg bg-blue-400/40 rounded-lg">{data[id].find(item => parseInt(item.token_id) === nft.token_id).account_address}</p>
                                </div>
                            ) : (
                                <RedeemButton nft={nft} redeemNFT={redeemNFT} flag={flag} setFlag={setFlag} />
                            )}
                    </div>
                </div>
            ))}
        </div>

    )
}

export default Redeem;