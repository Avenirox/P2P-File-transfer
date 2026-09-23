// FUNCTIONS FOR SENDSECONDSTEP.TSX

// 1. CALCULATE FILE SIZE FUNCTION
export const calculateFileSize = (size: number) => {
    //calculating file size
    if (size < 1024) {
        return `${size} B`// bytes
    }
    else if (size < 1024 ** 2) {
        return `${(size / 1024).toFixed(2)} KB`// kilobytes
    }
    else if (size < 1024 ** 3) {
        return `${(size / 1024 ** 2).toFixed(2)} MB`// megabytes
    }
    else if (size < 1024 ** 4) {
        return `${(size / 1024 ** 3).toFixed(2)} GB`// gigabytes
    }
    else {
        return `${(size / 1024 ** 4).toFixed(2)} TB`// else terabytes
    }
}

// 2. CACLULATE RAW NUMBER OF BYTES PER SECOND
export const formatBytesPerSecond = (rawNumber: number) => {
    const fixed = Number(rawNumber.toFixed(0))//fixing and changing to number

    if (fixed < 1024) {
        return `${fixed} B/s`// bytes per second
    }
    else if (fixed < 1024 ** 2) {
        const kb = (fixed / 1024).toFixed(0)
        return `${kb} KB/s`// kilobytes per second
    }
    else if (fixed < 1024 ** 3) {
        const mb = (fixed / 1024 ** 2).toFixed(0)
        return `${mb} MB/s`// megabytes per second
    }
    else if (fixed < 1024 ** 4) {
        const gb = (fixed / 1024 ** 3).toFixed(0)
        return `${gb} GB/s`// gigabytes per second
    }
    else {
        const tb = (fixed / 1024 ** 4).toFixed(0)
        return `${tb} TB/s`// terabytes per second
    }
}

// 3. CALCULATE ETA RAW SECONDS REMAINING
export const formatETAseconds = (rawSec: number) => {
    const fixed = Number(rawSec.toFixed(0))//fixing and changing to number

    if (fixed < 60) {
        return `${fixed} SEC`//seconds
    }
    else if (fixed < 60 * 60) {
        const min = (fixed / 60).toFixed(0)
        return `${min} MIN`//minutes
    }
    else {
        const hour = (fixed / 3600).toFixed(0)
        return `${hour} H`//hours
    }
}

// 4. WAKE LOCK (ALWAYS ON DISPLAY)
let wakeLock: WakeLockSentinel | null = null
export async function WakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen')
            console.log('WAKELOCK active')
        }
    }
    catch (err) {
        console.error('WAKELOCK ERROR: ', err)
    }
}
//clear wakelock function
export async function ClearWakeLock() {
    if (wakeLock !== null) {
        await new Promise(resolve => setTimeout(resolve, 100))
        wakeLock.release().then(() => {
            wakeLock = null
            console.log('WAKELOCK CLEARED')
        })
    }
}