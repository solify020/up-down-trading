import { useEffect, useRef } from 'react';

const TradingViewWidget = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            new (window as any).TradingView.widget({
                container_id: 'tv_chart_container',
                autosize: true,
                symbol: 'BINANCE:BTCUSDT',
                interval: '1',
                timezone: 'Etc/UTC',
                theme: 'dark',
                style: '1',
                locale: 'en',
                enable_publishing: true,
                hide_side_toolbar: true,
                allow_symbol_change: true,
            });
        };
        containerRef.current?.appendChild(script);
    }, []);

    return <div id="tv_chart_container" style={{ height: '600px', width: '100%' }} className='bg-transparent' ref={containerRef}></div>;
};

export default TradingViewWidget;