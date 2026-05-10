import User from '../models/user.js';
import Depo from '../models/depoModal.js';
import bcrypt from 'bcrypt';

const DEFAULT_DEPO_CODE = 'DEMO001';
const DEFAULT_DEPO_NAME = 'Demo Depot';
const DEFAULT_DEPO_ADDRESS = 'Demo Location';
const DEFAULT_EMAIL = 'demo@showcase.com';
const DEFAULT_PASSWORD = 'demo123';

export const initializeDefaultUser = async () => {
    try {
        // Check if default depo exists
        let depo = await Depo.findOne({ depoCode: DEFAULT_DEPO_CODE });
        
        if (!depo) {
            depo = await Depo.create({
                depoCode: DEFAULT_DEPO_CODE,
                depoName: DEFAULT_DEPO_NAME,
                depoAddress: DEFAULT_DEPO_ADDRESS
            });
            console.log('✓ Default depo created:', DEFAULT_DEPO_NAME);
        }

        // Check if default user exists
        let user = await User.findOne({ email: DEFAULT_EMAIL });
        
        if (!user) {
            const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
            user = await User.create({
                name: 'Demo User',
                email: DEFAULT_EMAIL,
                password: hashedPassword,
                depo: depo._id,
                isVerified: true
            });
            console.log('✓ Default user created:', DEFAULT_EMAIL);
        }

        return { depo, user };
    } catch (error) {
        console.error('Error initializing default user:', error.message);
    }
};

export const getDefaultCredentials = () => ({
    email: DEFAULT_EMAIL,
    password: DEFAULT_PASSWORD
});
