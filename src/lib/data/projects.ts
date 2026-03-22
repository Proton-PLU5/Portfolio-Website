import imgTomra from '$lib/assets/images/IMG_0632.jpg';
import imgProject2 from '$lib/assets/images/tomra/IMG_0622.jpg';
import { base } from '$app/paths';

export type Project = {
    id: string;
    subtitle: string;
    title: string;
    description?: string;
    year: string;
    company: string;
    tech: string[];
    image: string;
    url?: string;
};

export const projects: Project[] = [
    {
        id: 'tomra',
        subtitle: 'PROJECT / 01',
        title: 'Apple Segmentation Model',
        description: `Image segmentation model to detect and classify internal defects in apples, used to speed up annotation and improve sorting accuracy.`,
        year: '2025',
        company: 'Tomra Food',
        tech: ['Python', 'PyTorch', 'OpenCV'],
        image: imgTomra,
        url: `${base}/projects/tomra`
    },
    {
        id: 'project-2',
        subtitle: 'PROJECT / 02',
        title: 'Another ML Project',
        description: `Experimental model exploring data-efficient training techniques for small labelled datasets.`,
        year: '2024',
        company: 'Example Co',
        tech: ['Python'],
        image: imgProject2,
        url: `${base}/projects/project-2`
    }
];