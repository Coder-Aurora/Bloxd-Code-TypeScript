interface DelayTask {
    fireAt: number;
    callback: () => void;
};

interface LoopTask {
    interval: number;
    delayId: number | null;
};

const _DelayMap = new Map<number, DelayTask>();
const _LoopMap = new Map<number, LoopTask>();
let _DelayCounter: number = 0;
let _LoopCounter: number = 0;

export const Async = {
    setTimeout: (callback: () => void, ms: number = 1000): number => {
        const Id: number = ++_DelayCounter;

        _DelayMap.set(Id, {
            fireAt: api.now() + ms,
            callback
        });

        return Id;
    },

    cancelExecution: (callbackId: number): boolean => _DelayMap.delete(callbackId),

    setIntervalLoop: (callback: () => void, intervalMs: number = 1000): number => {
        const LoopId = ++_LoopCounter;

        const scheduleNext = () => {
            const DelayId = Async.setTimeout(() => {
                if (!_LoopMap.has(LoopId)) return;

                try {
                    callback();
                } catch (err) {
                    console.log(`Caught loop error: ${err}`);
                }

                if (_LoopMap.has(LoopId)) {
                    scheduleNext();
                }
            }, intervalMs);

            const LoopItem = _LoopMap.get(LoopId);
            if (LoopItem) {
                LoopItem.delayId = DelayId;
            }
        };

        _LoopMap.set(LoopId, {
            interval: intervalMs,
            delayId: null
        });

        scheduleNext();

        return LoopId;
    },

    clearIntervalLoop: (loopId: number): boolean => {
        const LoopItem = _LoopMap.get(loopId);
        if (!LoopItem) return false;

        if (LoopItem.delayId) {
            Async.cancelExecution(LoopItem.delayId);
        }
        _LoopMap.delete(loopId);

        return true;
    }
};

const _processQueue = (): void => {
    const now = api.now();

    Array.from(_DelayMap.entries()).forEach(([id, item]) => {
        if (now >= item.fireAt) {
            _DelayMap.delete(id);
            try {
                item.callback();
            } catch (err) {
                console.log(`Caught error: ${err}`);
            }
        }
    });
};

tick = (ms) => {
    _processQueue();
};
