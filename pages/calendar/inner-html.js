const day = `
<div class="page-calendar-day-date"></div>
<div class="page-calendar-day-shift"></div>
`;

const days = `
<div class="page-calendar-days ui-grid-row">
    <div class="ui-grid-column ui-card">${day}</div>
    <div class="ui-grid-column ui-card">${day}</div>
    <div class="ui-grid-column ui-card">${day}</div>
    <div class="ui-grid-column ui-card">${day}</div>
    <div class="ui-grid-column ui-card">${day}</div>
    <div class="ui-grid-column ui-card">${day}</div>
    <div class="ui-grid-column ui-card">${day}</div>
</div>
`;

const item = `
<div class="ui-grid">
    <div class="page-calendar-week-days ui-grid-row">
        <div class="ui-grid-column ui-card"></div>
        <div class="ui-grid-column ui-card"></div>
        <div class="ui-grid-column ui-card"></div>
        <div class="ui-grid-column ui-card"></div>
        <div class="ui-grid-column ui-card"></div>
        <div class="ui-grid-column ui-card"></div>
        <div class="ui-grid-column ui-card"></div>
    </div>

    ${days} ${days} ${days} ${days} ${days} ${days}
</div>
`;

export default `
<div class="page-calendar-item is-max no-user-select">
${item}
</div>

<div class="page-calendar-item is-max no-user-select">
${item}
</div>

<div class="page-calendar-item is-max no-user-select">
${item}
</div>
`;
