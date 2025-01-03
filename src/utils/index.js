export const formatDate = (date) => {
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
};

export function dateFormatter(dateString) {
    const inputDate = new Date(dateString);
    if (isNaN(inputDate)) {
        return 'Invalid Date';
    }

    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

export function getInitials(fullName) {
    if (!fullName) {
        return '';
    }
    const names = fullName.split(' ');
    const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());
    const initialsStr = initials.join('');
    return initialsStr;
}

export const PRIOTITYSTYLES = {
    high: 'text-red-600 bg-red-100',
    medium: 'text-yellow-600 bg-yellow-100',
    normal: 'text-gray-600 bg-gray-100',
    low: 'text-blue-600 bg-blue-100',
};

export const TASK_TYPE = {
    TODO: 'bg-blue-600',
    IN_PROGRESS: 'bg-yellow-600',
    COMPLETED: 'bg-green-600',
};

export const BGS = [
    'bg-blue-600',
    'bg-yellow-600',
    'bg-red-600',
    'bg-green-600',
];

// Tambahkan fungsi formatStage
export const formatStage = (stage) => {
    if (stage === 'IN_PROGRESS') {
        return 'IN-PROGRESS';
    }
    return stage;
};
