#include <iostream>
#include <stdio.h>
#include <math.h>
#include <vector>
#include <algorithm>
#define PI 3.14159265

using namespace std;

void interpolationTest();
void polynomialTest();

void logPolynomial(vector<double> P, string poliName);
void logCalculate(int i, int j, vector<vector<double> > M, vector<double> x);
void logResult(vector<double> x, vector<vector<double> > M);

void getPolynomial(vector<double> &P, string poliName);
void getPoints(vector<double> &x, vector<vector<double> > &M);
void interpolateMatrix(vector<double> &x, vector<vector<double> > &M);

vector<double> polynomialAddition(vector<double> P, vector<double> Q);
vector<double> polynomialMultiply(vector<double> P, vector<double> Q);
void fuggveny(double x);

int main()
{
	//interpolationTest();
	//polynomialTest ();
    return 0;
}


void interpolationTest() {
	cout << "Interpolacio" << endl;
	vector<double> x;
	vector<vector<double> > M;
	getPoints(x, M);
	interpolateMatrix(x, M);
	logResult(x, M);
}

void polynomialTest() {
	vector<double> P, Q;
	getPolynomial(P, "P");
	getPolynomial(Q, "Q");

	logPolynomial(P, "P");
	logPolynomial(Q, "Q");
	
	vector<double> R;
	R = polynomialAddition(P, Q);
	logPolynomial(R, "Osszeg");
	R = polynomialMultiply(P, Q);
	logPolynomial(R, "Szorzat");
};

void getPolynomial(vector<double> &P, string poliName) {
	int n;
	cout << poliName <<"\n Hanyadfoku a polinom? n= "; cin>> n;
	P.resize(n);
	for (unsigned i = 0; i < P.size(); i++) {
	 	cout << i << " foku tag:"; cin >> P[i];
	};
}

void logPolynomial(vector<double> P, string poliName) {
	cout << poliName << endl;
	int forSize = P.size() - 1;
	for (unsigned i = 0; i < forSize; i++) {
		cout<< P[i] <<" x^"<<i<<" + ";
	};
	cout<< P[forSize] <<" x^"<< forSize << endl; 
}

void logCalculate(int i, int j, vector<vector<double> > M, vector<double> x) {
	cout << i << j << " = ";
	cout << i-1 << j << " - " << i-1 << j-1 << " // " << j << j-i;
	cout << endl;
	cout << M[i-1][j] << " - " << M[i-1][j-1] << " / " << x[j] <<" - "<< x[j-i];
	cout << " = " <<  M[i-1][j]-M[i-1][j-1] << "/" << x[j]-x[j-i];
	cout << " = " <<  (M[i-1][j]-M[i-1][j-1])/(x[j]-x[j-i]);
	cout << endl;
}

void logResult(vector<double> x, vector<vector<double> > M) {
	cout << endl <<" Eredmény: "<< M.size() << endl;
	for (int i = 0; i < M.size(); i++) {
		cout<<"\t";
		cout<<x[i]<<" | ";
		for (int j = 0; j < M.size(); j++) {
			cout<<M[j][i]<<"\t";
		}; 
		cout<<endl;
	};
}

void getPoints(vector<double> &x, vector<vector<double> > &M) {
	int n;
	cout<<"Adja meg hany pontban vizsgaljuk!"<<endl; 
	cin>>n;
	x.resize(n);
	M.resize(n);
	for (int i = 0; i < n; i++) { 
		M[i].resize(n);
		for (int j = 0; j < n; j++) {
			M[i][j] = 0;
		}
	}

	cout<<"Adja meg a pontokat!"<<endl;
	for (int i = 0; i < n; i++) { 
		cout << i+1 << ". pont: " <<  endl; 
		cout << "\tx: "; cin >> x[i];
		cout << "\tf(x): "; cin >> M[0][i];
	};
}

void interpolateMatrix(vector<double> &x, vector<vector<double> > &M)
{
	int n = M.size();

	cout << endl <<" Kalkulátor Logika: "<< endl;
	for (int i = 1; i < n; i++) {
		for(int j = i; j < n; j++){
			logCalculate(i, j, M, x);
			//if (x[j] == x[j-i]) break;
			M[i][j] = (M[i-1][j]-M[i-1][j-1])/(x[j]-x[j-i]); 
		};
	}
}

//-----------------------------------------------------------------------Polinomok es Muveletek

//-----------------------------------------------------------------------Polinomok es Muveletek

//------------------------------------------------------Polinom Oszzeg
vector<double> polynomialAddition(vector<double> P, vector<double> Q) { 
	bool nagyP = false;
	if (P.size() > Q.size()) { 
		nagyP = true;
	}

	vector<double> S (max(P.size(),Q.size()));
	unsigned k;
	for( k=0;k<min(P.size(),Q.size());k++) { 
		S[k]=P[k]+Q[k];
	};
	if (nagyP) {
		for(unsigned i=k;i<S.size();i++){
			S[i]=P[i]; 
		} 
	} else { 
		for(unsigned i=k;i<S.size();i++){
			S[i]=P[i]; 
		}  
	};
  return S;
};
//------------------------------------------------------Polinom Oszzeg Vege

//------------------------------------------------------Polinom Szorzat
vector<double> polynomialMultiply(vector<double> P, vector<double> Q)
{
    vector<double> R((P.size()+Q.size())-1);
    for (unsigned i = 0; i < R.size(); i++) {
    	R[i]=0;
    };
    for (unsigned i = 0; i < P.size(); i++) { 
    	for (unsigned j = 0; j < Q.size(); j++) {  
    		R[i+j] += P[i]*Q[j]; 
   		};
    };
    return R;
};
//------------------------------------------------------Polinom Szorzat Vege


//------------------------------------------------------Fuggvenyertek Visszaadas
double f(double x) { 
	double sinx,y;
	sinx = sin (x*PI/180);
	y=(-1)*exp((x/2)*sinx);
	return y;
};
void fuggveny() {
	double x;
	cout << "x= "; cin>> x;
    cout <<"f(x)=  "<< f(x) <<endl;
};
//-------------------------------------------------------Fuggvenyertek Visszaadas Vege
