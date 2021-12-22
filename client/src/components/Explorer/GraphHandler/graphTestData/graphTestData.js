export const bargraphTestData = {
  datasets: [
    {
      label: 'Danceability',
      data: [{ label: 'Danceability', data: 1500 }],
    },
    {
      label: 'Energy',
      data: [{ label: 'Energy', data: 1500 }],
    },
  ],
}

// couldn't get this shaped right for some reason
export const linegraphTestData = {
  datasets: [
    {
      label: 'Danceability',
      data: [
        { date: 'Mon Aug 2 2021', value: 1300 },
        { date: 'Tues Aug 3 2021', value: 1500 },
        { date: 'Wed Aug 4 2021', value: 1400 },
      ],
    },
    {
      label: 'Energy',
      data: [{ date: 'Aug 2 2021', value: 1500 }],
    },
  ],
}
