using {InvoiceAssessmentService} from './invoice-assessment-service';

annotate InvoiceAssessmentService.Positions with @(restrict: [
    {
        grant: 'READ',
        to   : 'authenticated-user'
    },
    {
        grant: [
            'CREATE',
            'DELETE'
        ],
        to   : 'authenticated-user',
        where   : 'exists invoice[CV_user_ID = $user]'
    },
    {
        grant: '*',
        to   : 'admin'
    }
]);

annotate InvoiceAssessmentService.PositionCorrections with @(restrict: [
    {
        grant: 'READ',
        to   : 'authenticated-user'
    },
    {
        grant: [
            'CREATE',
            'UPDATE'
        ],
        to   : 'authenticated-user',
        where   : 'exists position.invoice[CV_user_ID = $user]'
    },
    {
        grant: '*',
        to   : 'admin'
    }
]);

annotate InvoiceAssessmentService.Deductions with @(restrict: [
    {
        grant: 'READ',
        to   : 'authenticated-user'
    },
    {
        grant: [
            'CREATE',
            'DELETE'
        ],
        to   : 'authenticated-user',
        where   : 'exists invoice[CV_user_ID = $user]'
    },
    {
        grant: '*',
        to   : 'admin'
    }
]);

annotate InvoiceAssessmentService.DeductionVersions with @(restrict: [
    {
        grant: 'READ',
        to   : 'authenticated-user'
    },
    {
        grant: '*',
        to   : 'admin'
    }
]);

annotate InvoiceAssessmentService.Retentions with @(restrict: [
    {
        grant: 'READ',
        to   : 'authenticated-user'
    },
    {
        grant: [
            'CREATE',
            'DELETE'
        ],
        to   : 'authenticated-user',
        where   : 'exists invoice[CV_user_ID = $user]'
    },
    {
        grant: '*',
        to   : 'admin'
    }
]);

annotate InvoiceAssessmentService.RetentionVersions with @(restrict: [
    {
        grant: 'READ',
        to   : 'authenticated-user'
    },
    {
        grant: '*',
        to   : 'admin'
    }
]);

annotate InvoiceAssessmentService.Projects_Users with @(restrict: [
    {
        grant: 'READ',
        to   : 'authenticated-user'
    },
    {
        grant: '*',
        to   : 'admin'
    }
]);

annotate InvoiceAssessmentService.Users with @(restrict: [
    {
        grant: 'READ',
        to   : 'authenticated-user'
    },
    {
        grant: '*',
        to   : 'admin'
    }
]);
