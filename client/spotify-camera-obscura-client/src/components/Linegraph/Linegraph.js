import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const Linegraph = function ({ dateRange, currentTracks }) {
    const [labels, setLabels] = useState(0);
    const [datas, setDatas] = useState(0);

    useEffect(() => {
        console.log(dateRange);
        console.log(currentTracks);
        // let [labelArr, datasArr] = getDates(dateRange[0], dateRange[1]);
        // setLabels(labelArr);
        // setDatas(datasArr);
        // // console.log(labelArr);
    }, [dateRange, currentTracks]);

    const data = {
        labels: labels,
        datasets: [
            {
                label: '# of Votes',
                data: datas,
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };

    // ! this function was mutating the dateRange prop being passed in
    // function getDates(startDate, stopDate) {
    //     var dateArray = [];
    //     var dataArray = [];
    //     var currentDate = startDate;
    //     let i = 0;
    //     while (currentDate <= stopDate) {
    //         dataArray.push(i);
    //         dateArray.push(new Date(currentDate));
    //         // console.log(currentDate);
    //         currentDate.setDate(currentDate.getDate() + 1);
    //     }
    //     // console.log('dateArray', dateArray);
    //     // console.log('dataArray', dataArray);
    //     return [dateArray, dataArray];
    // }

    return <Line data={data} options={options} />;
};

export default Linegraph;
