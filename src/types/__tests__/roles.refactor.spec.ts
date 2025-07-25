import { UserRole } from '../auth';

describe('Roles enum unification baseline', () => {
  it('should include all four lowercase roles', () => {
    const roles: UserRole[] = [
      'admin',
      'practitioner',
      'pharmacy_operator',
      'patient',
    ];

    expect(roles).toContain('admin');
    expect(roles).toContain('practitioner');
    expect(roles).toContain('pharmacy_operator');
    expect(roles).toContain('patient');
  });
}); 