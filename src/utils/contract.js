
import { ethers } from 'ethers';
import { getWalletClient } from '@wagmi/core';
import { config } from '../wagmi';
import VoucherKopiABI from '../VoucherKopi.json';

export const contractAddress = '0x73c02dd858F4669a60d1eFe536400D01F7805Fe6';
export const contractAbi = VoucherKopiABI.abi;

function walletClientToSigner(walletClient) {
    const { account, chain, transport } = walletClient;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new ethers.BrowserProvider(transport, network);
    const signer = new ethers.JsonRpcSigner(provider, account.address);
    return signer;
}

async function getContractWithSigner() {
    const walletClient = await getWalletClient(config);
    if (!walletClient) throw new Error("Wallet not connected. Please connect your wallet.");
    const signer = walletClientToSigner(walletClient);
    return new ethers.Contract(contractAddress, contractAbi, signer);
}

function getContractWithProvider() {
    const provider = new ethers.JsonRpcProvider(config.chains[0].rpcUrls.default.http[0]);
    return new ethers.Contract(contractAddress, contractAbi, provider);
}

// ==========================================================================================
// FUNGSI-FUNGSI INTERAKSI KONTRAK
// ==========================================================================================

/**
 * Mencetak voucher baru. Hanya bisa dipanggil oleh pemilik kontrak.
 * @param {string} recipientAddress - Alamat penerima voucher baru.
 * @param {string} tokenURI - URI metadata IPFS untuk voucher.
 * @param {number} voucherType - Tipe voucher (0: Espresso, 1: Cappuccino, 2: Luwak).
 * @returns {Promise<ethers.TransactionResponse>}
 */
export async function mintVoucher(recipientAddress, tokenURI, voucherType) {
    console.log(`Minting voucher... Recipient: ${recipientAddress}, URI: ${tokenURI}, Type: ${voucherType}`);
    const contract = await getContractWithSigner();
    const tx = await contract.mintVoucher(recipientAddress, tokenURI, voucherType, {
        gasLimit: 600000 // Gas limit yang lebih tinggi untuk minting
    });
    console.log("Minting transaction sent:", tx.hash);
    return tx;
}


export async function redeemVoucherByOwner(tokenId, signature) {
    console.log(`Preparing to redeem token ID ${tokenId} by owner...`);
    const contract = await getContractWithSigner();
    const tx = await contract.redeemVoucherByOwner(tokenId, signature, {
        gasLimit: 500000
    });
    console.log("Redemption transaction sent:", tx.hash);
    return tx;
}

export async function getVoucherDetails(tokenId) {
    const contract = getContractWithProvider();
    const tokenURI = await contract.tokenURI(tokenId);
    const owner = await contract.ownerOf(tokenId);

    const metadataResponse = await fetch(tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'));
    if (!metadataResponse.ok) {
        throw new Error("Failed to fetch metadata from token URI");
    }
    const metadata = await metadataResponse.json();

    return {
        tokenId,
        owner,
        ...metadata,
    };
}

export async function transferVoucher(toAddress, tokenId) {
    const contract = await getContractWithSigner();
    const fromAddress = contract.signer.address;
    const tx = await contract.transferFrom(fromAddress, toAddress, tokenId);
    return tx;
}
